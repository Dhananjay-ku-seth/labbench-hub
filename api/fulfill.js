import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import getRawBody from "raw-body";
import nodemailer from "nodemailer";

// Razorpay webhook -> verify -> email the matching PDF to the buyer.
// Configure in Razorpay Dashboard: Settings -> Webhooks -> Active Events: payment.captured

export const config = {
  api: { bodyParser: false },
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Match on the Payment Page title/description you set in Razorpay.
// Keys are matched as a case-insensitive substring of the payment description.
const PRODUCTS = [
  {
    match: "labbench study companion",
    file: "LabBench_Study_Companion.pdf",
    attachmentName: "LabBench Study Companion.pdf",
    label: "LabBench Study Companion",
  },
  {
    match: "making of labbench",
    file: "The_Making_of_LabBench.pdf",
    attachmentName: "The Making of LabBench.pdf",
    label: "The Making of LabBench",
  },
  {
    match: "cheat sheet",
    file: "LabBench_Cheat_Sheets.pdf",
    attachmentName: "LabBench Cheat Sheets.pdf",
    label: "LabBench Cheat Sheets",
  },
  {
    match: "interview prep",
    file: "LabBench_Interview_Prep_Kit.pdf",
    attachmentName: "LabBench Interview Prep Kit.pdf",
    label: "LabBench Interview Prep Kit",
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set");
    return res.status(500).json({ error: "server not configured" });
  }

  const rawBody = await getRawBody(req);
  const headerSignature = req.headers["x-razorpay-signature"];
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (
    !headerSignature ||
    typeof headerSignature !== "string" ||
    headerSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(headerSignature), Buffer.from(expectedSignature))
  ) {
    return res.status(403).json({ error: "invalid signature" });
  }

  const event = JSON.parse(rawBody.toString("utf-8"));

  if (event.event !== "payment.captured") {
    return res.status(200).json({ ok: true, skipped: "not a payment.captured event" });
  }

  const payment = event.payload?.payment?.entity;
  const email = payment?.email;
  const description = (payment?.description || "").toLowerCase();

  if (!email) {
    return res.status(200).json({ ok: true, skipped: "no buyer email on payment" });
  }

  const product = PRODUCTS.find((p) => description.includes(p.match));
  if (!product) {
    console.warn("No matching product for description:", description);
    return res.status(200).json({ ok: true, skipped: "no matching product" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const amount = ((payment.amount || 0) / 100).toFixed(2);
  const currency = payment.currency || "INR";
  const paidAt = new Date((payment.created_at || Date.now() / 1000) * 1000).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const summaryText =
    `Payment summary\n` +
    `----------------\n` +
    `Item:        ${product.label}\n` +
    `Amount paid: ${currency} ${amount}\n` +
    `Payment ID:  ${payment.id}\n` +
    `Date:        ${paidAt} IST\n`;

  const summaryHtml =
    `<table style="border-collapse:collapse;margin:16px 0;font-family:sans-serif;font-size:14px">` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Item</td><td><b>${product.label}</b></td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Amount paid</td><td><b>${currency} ${amount}</b></td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Payment ID</td><td>${payment.id}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Date</td><td>${paidAt} IST</td></tr>` +
    `</table>`;

  await transporter.sendMail({
    from: `LabBench <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your ${product.label} download (Payment ${payment.id})`,
    text:
      `Thanks for supporting LabBench!\n\n` +
      summaryText +
      `\nYour PDF, "${product.label}", is attached.\n\n` +
      `More tools: https://labbench-hub.vercel.app/\n\n` +
      `- Dhananjay`,
    html:
      `<p>Thanks for supporting LabBench!</p>` +
      summaryHtml +
      `<p>Your PDF, "<b>${product.label}</b>", is attached.</p>` +
      `<p>More tools: <a href="https://labbench-hub.vercel.app/">labbench-hub.vercel.app</a></p>` +
      `<p>- Dhananjay</p>`,
    attachments: [
      {
        filename: product.attachmentName,
        path: path.join(__dirname, "assets", product.file),
      },
    ],
  });

  return res.status(200).json({ ok: true, sent: product.label, to: email });
}
