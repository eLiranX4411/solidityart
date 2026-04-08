import { useLocation, useNavigate } from 'react-router-dom';
import ScoreRing from '../../components/ScoreRing/ScoreRing';
import IssueCard from '../../components/IssueCard/IssueCard';
import SeverityBadge from '../../components/SeverityBadge/SeverityBadge';
import styles from './ReportPage.module.scss';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Info'];

function countBySeverity(issues) {
  return SEVERITIES.reduce((acc, s) => {
    acc[s] = issues.filter(i => i.severity === s).length;
    return acc;
  }, {});
}

export default function ReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.report) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>No report found.</p>
          <button className="btn btn--primary" onClick={() => navigate('/scan')}>
            Scan a Contract
          </button>
        </div>
      </main>
    );
  }

  const { report } = state;
  const counts = countBySeverity(report.issues);

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <button className={`btn btn--ghost ${styles.back}`} onClick={() => navigate('/scan')}>
          ← New Scan
        </button>
        <span className={styles.logo}>SolidityArt</span>
      </nav>

      <div className={styles.content}>
        {/* Header card */}
        <div className={styles.headerCard}>
          <div className={styles.scoreSection}>
            <ScoreRing score={report.score} />
            <div className={styles.scoreInfo}>
              <h1 className={styles.reportTitle}>Security Report</h1>
              <p className={styles.summary}>{report.summary}</p>
            </div>
          </div>

          {/* Severity summary */}
          <div className={styles.severitySummary}>
            {SEVERITIES.map(s => (
              <div key={s} className={styles.severityCell}>
                <span className={styles.severityCount} data-severity={s.toLowerCase()}>
                  {counts[s]}
                </span>
                <SeverityBadge severity={s} />
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {report.issues.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Issues Found
              <span className={styles.issueCount}>{report.issues.length}</span>
            </h2>
            <div className={styles.issueList}>
              {report.issues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>
        ) : (
          <div className={styles.noIssues}>
            <span className={styles.noIssuesIcon}>✓</span>
            <p>No vulnerabilities detected</p>
          </div>
        )}

        {/* Positives */}
        {report.positives?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What the Contract Does Well</h2>
            <ul className={styles.positivesList}>
              {report.positives.map((p, i) => (
                <li key={i} className={styles.positive}>
                  <span className={styles.checkmark}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
