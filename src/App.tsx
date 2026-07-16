type Tool = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  accent: string;
  glow: string;
  demo: string;
  repo: string;
  icon: JSX.Element;
};

const TOOLS: Tool[] = [
  {
    id: "dsp",
    name: "DSP Signal Lab",
    tag: "Signal Processing",
    desc: "Real-time FFT spectrum analyzer, waveform generator, and digital filters — powered by the Web Audio API.",
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.35)",
    demo: "https://dsp-signal-lab.vercel.app/",
    repo: "https://github.com/Dhananjay-ku-seth/dsp-signal-lab",
    icon: <path d="M3 12h3l2-7 4 14 3-9 2 5h4" />,
  },
  {
    id: "pid",
    name: "PID Control Playground",
    tag: "Control Systems",
    desc: "Tune a line-follower robot's Kp/Ki/Kd live and watch it track — or oscillate — a winding path.",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    demo: "https://pid-control-playground.vercel.app/",
    repo: "https://github.com/Dhananjay-ku-seth/pid-control-playground",
    icon: <path d="M4 18c3-9 6 9 9 0s5-9 7 0" />,
  },
  {
    id: "logic",
    name: "Logic Circuit Simulator",
    tag: "Digital Design",
    desc: "Drag-and-wire gates, toggle inputs, and watch signals propagate live with an auto-generated truth table.",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    demo: "https://logic-circuit-sim.vercel.app/",
    repo: "https://github.com/Dhananjay-ku-seth/logic-circuit-sim",
    icon: <path d="M4 8h4v8H4zM10 6v4h4V6zM10 14v4h4v-4zM18 10h2M18 14h2M14 8l4 2M14 16l4-2" />,
  },
  {
    id: "comms",
    name: "Comms Simulator",
    tag: "Communication Systems",
    desc: "AM/FM modulation, BPSK/QPSK/16-QAM constellations, and Monte-Carlo BER-vs-SNR curves.",
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    demo: "https://comms-simulator-pi.vercel.app/",
    repo: "https://github.com/Dhananjay-ku-seth/comms-simulator",
    icon: <path d="M12 4v16M6 8l-3 4 3 4M18 8l3 4-3 4" />,
  },
  {
    id: "waveform",
    name: "Waveform Viewer",
    tag: "Digital Timing",
    desc: "Click to drive a D flip-flop, clock divider, counter, or shift register — Verilog-style timing diagrams that update live.",
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    demo: "https://waveform-viewer-theta.vercel.app/",
    repo: "https://github.com/Dhananjay-ku-seth/waveform-viewer",
    icon: <path d="M2 12h3v-4h3v8h3v-6h3v6h3v-4h3" />,
  },
];

function Logo() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="1" y="1" width="40" height="40" rx="10" fill="#0d1420" stroke="#f5a623" strokeWidth="1.5" />
      <path d="M9 28h24" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 28V16a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="17" cy="20" r="1.6" fill="#38bdf8" />
      <circle cx="25" cy="20" r="1.6" fill="#38bdf8" />
    </svg>
  );
}

export default function App() {
  return (
    <div className="app">
      <header>
        <div className="brand">
          <Logo />
          <div>
            <h1>LabBench</h1>
            <p className="tag">Your engineering lab, in the browser.</p>
          </div>
        </div>
        <div className="header-links">
          <a className="support-pill" href="https://rzp.io/rzp/hBy3YQN" target="_blank" rel="noopener noreferrer">☕ Support</a>
          <a className="pill" href="https://dhananjay-kumar-seth.vercel.app/" target="_blank" rel="noopener noreferrer">
            by Dhananjay Kumar Seth ↗
          </a>
        </div>
      </header>

      <section className="hero">
        <h2>Five interactive engineering tools. Zero installs.</h2>
        <p>
          DSP, control systems, digital logic, and communications — concepts that usually live in
          textbooks and MATLAB scripts, turned into things you can click, drag, and tune in real time.
        </p>
      </section>

      <section className="grid">
        {TOOLS.map((t) => (
          <article key={t.id} className="card" style={{ ["--accent" as any]: t.accent, ["--glow" as any]: t.glow }}>
            <div className="card-top">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <span className="tag-chip">{t.tag}</span>
            </div>
            <h3>{t.name}</h3>
            <p>{t.desc}</p>
            <div className="card-links">
              <a className="launch" href={t.demo} target="_blank" rel="noopener noreferrer">Launch ▶</a>
              <a className="src" href={t.repo} target="_blank" rel="noopener noreferrer">Source</a>
            </div>
          </article>
        ))}
      </section>

      <section className="pricing">
        <div className="pricing-card free">
          <span className="ptag">Free</span>
          <h3>All 5 tools, fully open</h3>
          <p>Every demo above is free to use for personal, educational, and portfolio purposes — no account, no limits.</p>
          <a className="notify support-link" href="https://rzp.io/rzp/hBy3YQN" target="_blank" rel="noopener noreferrer">☕ Enjoying it? Support LabBench →</a>
        </div>
        <div className="pricing-card pro">
          <span className="ptag pro-tag">Pro · Coming Soon</span>
          <h3>Saved sessions, exports &amp; classroom mode</h3>
          <p>Save/share circuit &amp; signal setups, export plots and reports, and a classroom mode for instructors. Low-cost, one-time or subscription — details soon.</p>
          <a className="notify" href="mailto:adplayers746@gmail.com?subject=LabBench%20Pro%20waitlist">Get notified →</a>
        </div>
      </section>

      <footer>
        <p>© 2026 Dhananjay Kumar Seth. All rights reserved. Source code is licensed for personal &amp; educational use — see each repository's LICENSE for terms.</p>
        <div className="links">
          <a href="https://dhananjay-kumar-seth.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <a href="https://github.com/Dhananjay-ku-seth" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/dhananjay-kumar-seth-4a5b31283/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:adplayers746@gmail.com">Contact</a>
        </div>
      </footer>
    </div>
  );
}
