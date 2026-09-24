import nodemailer from "nodemailer";

// Contact form for the portfolio (https://dhananjay-kumar-seth.vercel.app).
// Emails the message to Dhananjay using the same Gmail sender the PDF fulfilment already uses.
// Env: GMAIL_USER, GMAIL_APP_PASSWORD (already configured for api/fulfill.js).

const OWNER_EMAIL = "adplayers746@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://dhananjay-kumar-seth.vercel.app",
  "http://localhost:5198",
  "http://127.0.0.1:5198",
]);

// Best-effort abuse guard: at most 5 messages per address per 10 minutes on a warm instance.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const oneLine = (s, max) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  // Health check: reports whether the mail sender is configured, never any secret.
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, configured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  if (origin && !ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ error: "origin not allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "invalid body" });

  // Honeypot: real visitors never fill this in. Pretend success so bots learn nothing.
  if (body.website) return res.status(200).json({ ok: true });

  const name = oneLine(body.name, 80);
  const email = oneLine(body.email, 120);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (!name) return res.status(400).json({ error: "name required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "valid email required" });
  if (message.length < 10) return res.status(400).json({ error: "message too short" });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip) || limited(email.toLowerCase())) return res.status(429).json({ error: "too many messages, try again later" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("contact: GMAIL_USER / GMAIL_APP_PASSWORD not set");
    return res.status(500).json({ error: "server not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `Portfolio contact <${user}>`,
      to: OWNER_EMAIL,
      replyTo: `${name.replace(/[<>"]/g, "")} <${email}>`,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n--\nFrom: ${name} <${email}>\nSent via dhananjay-kumar-seth.vercel.app`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: sending failed:", err);
    return res.status(502).json({ error: "could not send" });
  }
}
