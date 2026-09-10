import { DecisionLog } from "./components/DecisionLog";
import { EvidenceLedger } from "./components/EvidenceLedger";
import { SkillPatternBoard } from "./components/SkillPatternBoard";
import { labContract } from "./labContract";
import { useState } from "react";
import { selectNotificationRoute } from "./notification/routeNotification.mjs";
import { evidenceStatus, readinessScore, riskSummary } from "./skillWorkflow";
import "./styles.css";

export default function App() {
  const score = readinessScore(labContract);
  const risks = riskSummary(labContract.backlog);
  const evidence = evidenceStatus(labContract.evidence);
  const [providers, setProviders] = useState({ pushAvailable: false, smsAvailable: true, smsConsent: false, emailAvailable: true });
  const route = selectNotificationRoute(providers);

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="kicker">{labContract.competency}</p>
          <h1>{labContract.title}</h1>
          <p>{labContract.mission}</p>
        </div>
        <div className="score-card">
          <span>Readiness</span>
          <strong>{score}%</strong>
          <small>{score >= 75 ? "ready for review" : "needs implementation evidence"}</small>
        </div>
      </section>

      <section className="panel" aria-label="Notification routing preview">
        <h2>Notification routing preview</h2>
        <fieldset>
          <legend>Recipient permissions and provider status</legend>
          {([
            ["pushAvailable", "Push available"], ["smsAvailable", "SMS available"],
            ["smsConsent", "Recipient permits SMS"], ["emailAvailable", "Email available"],
          ] as const).map(([key, label]) => (
            <label key={key}>
              <input type="checkbox" checked={providers[key]} onChange={(event) => setProviders({ ...providers, [key]: event.target.checked })} />
              {label}
            </label>
          ))}
        </fieldset>
        <p role="status">Selected route: {route.channel}. {route.durable ? "Saved for later delivery." : "Ready for immediate delivery."}</p>
        <p>This local preview makes no external delivery calls.</p>
      </section>

      <section className="metrics">
        <article>
          <span>Entities</span>
          <strong>{labContract.entities.length}</strong>
          <small>{labContract.entities.join(", ")}</small>
        </article>
        <article>
          <span>High risk cards</span>
          <strong>{risks.high + risks.critical}</strong>
          <small>must be handled before merge</small>
        </article>
        <article>
          <span>Ready evidence</span>
          <strong>{evidence.ready ?? 0}</strong>
          <small>of {labContract.evidence.length} gates</small>
        </article>
      </section>

      <section className="grid">
        <SkillPatternBoard contract={labContract} />
        <EvidenceLedger contract={labContract} />
        <DecisionLog contract={labContract} />
      </section>

      <section className="panel wide">
        <p className="kicker">Outcome</p>
        <h2>What Good Looks Like</h2>
        <ul className="signal-list">
          {labContract.masterySignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
