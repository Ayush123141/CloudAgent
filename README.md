# 🩺 CloudDoctor (CloudAgent)

> **Autonomous Site Reliability Engineering (SRE) & Incident Remediation Platform**

CloudDoctor is a modern, real-time autonomous incident response and observability dashboard. It continuously monitors cloud services, correlates multi-modal telemetry (metrics, logs, traces, deployments, git diffs), performs autonomous Root Cause Analysis (RCA), executes digital twin sandbox simulations, and provides human-in-the-loop safety gates for automated production rollbacks.

---

## ✨ Features

- ⚡ **Autonomous Incident Diagnosis**: Automatically detects performance degradations, correlates telemetry across microservices, and generates confidence-scored root causes with clear causal evidence chains.
- 🧪 **Digital Twin Sandbox Simulation**: Simulates remediation actions (e.g., version rollbacks, traffic shifting) in an isolated sandbox to predict telemetry recovery before touching production.
- 🛡️ **Human-in-the-Loop Safety Gates**: Configurable approval policies requiring engineer sign-off for high-impact production operations.
- 🌓 **Dynamic Dual-Theme (Dark & Light Mode)**: Seamlessly switch between a sleek dark theme and a clean, high-contrast light mode with persistent user preferences.
- 📊 **Real-Time Observability**: Live metric charts (Error Rate, CPU Saturation, P99 Latency) powered by Recharts with timeline reference lines and telemetry slicing.
- 📜 **Cryptographic Audit Action Log**: Full auditable trail of all autonomous agent investigations, proposals, approvals, and remediation executions.
- 🎨 **Modern Micro-Interactions**: Ambient 60fps canvas particle network and smooth Framer Motion layout transitions.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: Vanilla CSS Design Tokens + [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + Interactive HTML5 Canvas Particles
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
CloudAgent/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI primitives
│   │   │   ├── Badge.jsx
│   │   │   ├── ConfidenceGauge.jsx
│   │   │   ├── KpiCard.jsx
│   │   │   ├── Metric.jsx
│   │   │   ├── MetricChart.jsx
│   │   │   ├── Panel.jsx
│   │   │   ├── Pending.jsx
│   │   │   ├── StageProgress.jsx
│   │   │   └── StatusDot.jsx
│   │   ├── effects/             # Visual & background effects
│   │   │   └── ParticleBackground.jsx
│   │   ├── layout/              # Shell & navigation layout
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   └── views/               # Top-level view pages
│   │       ├── ActionLogPage.jsx
│   │       ├── IncidentsList.jsx
│   │       ├── Investigation.jsx
│   │       ├── Overview.jsx
│   │       ├── Recovery.jsx
│   │       ├── Remediation.jsx
│   │       ├── RootCause.jsx
│   │       ├── ServicesPage.jsx
│   │       ├── SettingsPage.jsx
│   │       └── TimelinePage.jsx
│   ├── context/
│   │   └── ThemeContext.jsx      # Theme state provider (light/dark mode)
│   ├── data/
│   │   └── mockData.js           # Time series, feeds, and incident scenarios
│   ├── styles/
│   │   └── theme.js              # Theme design tokens & color palettes
│   ├── App.jsx                   # Main application coordinator
│   ├── main.jsx                  # Application entrypoint
│   └── index.css                 # Base stylesheet & font definitions
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone or navigate to your project directory:**
   ```bash
   cd CloudAgent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 🔬 Incident Lifecycle Workflow

1. **Detection**: Metrics detect threshold breach (CPU saturation / error rate spike on `payment-service`).
2. **Investigation**: Multi-modal telemetry streams ingested and analyzed (metrics, logs, traces, deployments, git diffs).
3. **Root Cause Analysis (RCA)**: Identifies database query regression in `v1.8` with 89% confidence and step-by-step evidence chain.
4. **Remediation & Simulation**: Evaluates alternatives, predicts recovery in sandbox environment (`42% -> 3%` error rate).
5. **Safety Gate**: Requests SRE human approval for production traffic rollback.
6. **Execution & Recovery**: Executes rollback sequence (`v1.8 -> v1.7`), runs health checks, and confirms system stabilization.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
