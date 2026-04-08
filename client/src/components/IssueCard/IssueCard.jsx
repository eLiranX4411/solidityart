import { useState } from 'react';
import SeverityBadge from '../SeverityBadge/SeverityBadge';
import styles from './IssueCard.module.scss';

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''}`}>
      <button className={styles.header} onClick={() => setExpanded(v => !v)}>
        <div className={styles.headerLeft}>
          <SeverityBadge severity={issue.severity} />
          <span className={styles.title}>{issue.title}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className={styles.body}>
          <p className={styles.description}>{issue.description}</p>

          <div className={styles.codeSection}>
            <div className={styles.codeBlock}>
              <div className={styles.codeLabel}>
                <span className={styles.dot} style={{ background: '#ff4d4d' }} />
                Vulnerable
              </div>
              <pre className={styles.pre}><code>{issue.vulnerableCode}</code></pre>
            </div>

            <div className={styles.arrow}>→</div>

            <div className={styles.codeBlock}>
              <div className={styles.codeLabel}>
                <span className={styles.dot} style={{ background: '#06d6a0' }} />
                Fixed
              </div>
              <pre className={styles.pre}><code>{issue.fixedCode}</code></pre>
            </div>
          </div>

          <div className={styles.explanation}>
            <span className={styles.explanationLabel}>Why this fix works</span>
            <p>{issue.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
