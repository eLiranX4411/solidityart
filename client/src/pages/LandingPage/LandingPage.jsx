import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.scss';

const FEATURES = [
  {
    icon: '⚡',
    title: 'AI-Powered Analysis',
    desc: 'Claude scans your contract for reentrancy, overflow, access control flaws, and dozens more vulnerability classes.',
  },
  {
    icon: '🔍',
    title: 'Plain English Reports',
    desc: 'Every vulnerability explained in plain language — what it is, why it matters, and exactly how to fix it.',
  },
  {
    icon: '🛡',
    title: 'Security Score',
    desc: 'Get a 0-100 security score so you can track improvements across contract versions.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <span className={styles.logo}>SolidityArt</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className={styles.eyebrow}>Smart Contract Security</p>
        <h1 className={styles.headline}>
          Find vulnerabilities<br />before attackers do
        </h1>
        <p className={styles.subheadline}>
          Paste your Solidity code and receive a detailed AI-powered security
          audit in seconds — with fixes, not just flags.
        </p>
        <button className={`btn btn--primary ${styles.cta}`} onClick={() => navigate('/scan')}>
          Scan Your Contract
        </button>
      </section>

      <section className={styles.features}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>Built with Claude · Never stores your raw code</p>
      </footer>
    </main>
  );
}
