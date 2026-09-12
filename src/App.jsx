import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ParticleBackground from "./components/effects/ParticleBackground";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Overview from "./components/views/Overview";
import IncidentsList from "./components/views/IncidentsList";
import Investigation from "./components/views/Investigation";
import RootCause from "./components/views/RootCause";
import Remediation from "./components/views/Remediation";
import Recovery from "./components/views/Recovery";
import TimelinePage from "./components/views/TimelinePage";
import ActionLogPage from "./components/views/ActionLogPage";
import ServicesPage from "./components/views/ServicesPage";
import SettingsPage from "./components/views/SettingsPage";
import { FONT } from "./styles/theme";

function CloudDoctorMain() {
  const { theme } = useTheme();
  const [page, setPage] = useState("overview");
  const [stage, setStage] = useState("investigating");
  const [execStep, setExecStep] = useState(0);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    if (stage !== "executing") {
      if (stage !== "resolved") setExecStep(0);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setExecStep(Math.min(i, 5));
      if (i >= 5) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "executing" && execStep >= 5 && !demoRunning) {
      const t = setTimeout(() => setStage("resolved"), 500);
      return () => clearTimeout(t);
    }
  }, [execStep, stage, demoRunning]);

  function openInvestigation() {
    setPage("investigation");
    setStage((s) => (s === "healthy" || s === "detected" ? "investigating" : s));
  }
  function viewRootCause() {
    setStage("diagnosed");
    setPage("rootcause");
  }
  function viewRemediation() {
    setStage("remediation");
    setPage("remediation");
  }
  function simulateFix() {
    setStage("simulated");
  }
  function requestApproval() {
    setStage("approval");
  }
  function approveRollback() {
    setExecStep(0);
    setStage("executing");
    setPage("recovery");
  }
  function rejectRollback() {
    setStage("rejected");
  }

  function runDemo() {
    if (demoRunning) return;
    setDemoRunning(true);
    const seq = [
      { stage: "healthy", page: "overview", delay: 1500 },
      { stage: "detected", page: "overview", delay: 1700 },
      { stage: "investigating", page: "investigation", delay: 2600 },
      { stage: "diagnosed", page: "rootcause", delay: 2400 },
      { stage: "remediation", page: "remediation", delay: 1700 },
      { stage: "simulated", page: "remediation", delay: 1900 },
      { stage: "approval", page: "remediation", delay: 2000 },
      { stage: "executing", page: "recovery", delay: 3000 },
      { stage: "resolved", page: "recovery", delay: 0 },
    ];
    let t = 0;
    seq.forEach((step, i) => {
      setTimeout(() => {
        setStage(step.stage);
        setPage(step.page);
        if (step.stage === "executing") setExecStep(0);
        if (i === seq.length - 1) setDemoRunning(false);
      }, t);
      t += step.delay;
    });
  }

  return (
    <div
      className="flex relative"
      style={{
        height: "100vh",
        width: "100%",
        background: theme.bgGradient || theme.bg,
        color: theme.text,
        fontFamily: FONT,
        overflow: "hidden",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        table { font-variant-numeric: tabular-nums; }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme.name === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"};
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.name === "light" ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)"};
        }
      `}</style>

      {/* Ambient Particle JS Canvas Effect */}
      <ParticleBackground />

      {/* Navigation Sidebar */}
      <Sidebar page={page} setPage={setPage} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative z-1" style={{ minWidth: 0 }}>
        <TopBar page={page} stage={stage} onDemo={runDemo} demoRunning={demoRunning} />
        
        <main className="flex-1" style={{ overflowY: "auto", position: "relative" }}>
          <AnimatePresence mode="wait">
            {page === "overview" && (
              <Overview key="overview" stage={stage} onOpenIncident={openInvestigation} />
            )}
            {page === "incidents" && (
              <IncidentsList key="incidents" stage={stage} onOpenIncident={openInvestigation} />
            )}
            {page === "investigation" && (
              <Investigation key="investigation" stage={stage} onViewRootCause={viewRootCause} />
            )}
            {page === "rootcause" && (
              <RootCause key="rootcause" stage={stage} onViewRemediation={viewRemediation} />
            )}
            {page === "remediation" && (
              <Remediation
                key="remediation"
                stage={stage}
                onSimulate={simulateFix}
                onRequestApproval={requestApproval}
                onApprove={approveRollback}
                onReject={rejectRollback}
              />
            )}
            {page === "recovery" && (
              <Recovery key="recovery" stage={stage} execStep={execStep} />
            )}
            {page === "timeline" && <TimelinePage key="timeline" />}
            {page === "actionlog" && <ActionLogPage key="actionlog" stage={stage} />}
            {page === "services" && <ServicesPage key="services" stage={stage} />}
            {page === "settings" && <SettingsPage key="settings" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CloudDoctorMain />
    </ThemeProvider>
  );
}