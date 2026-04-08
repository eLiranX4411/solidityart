import styles from './ScanLoader.module.scss';

const STEPS = [
  'Parsing contract structure...',
  'Checking for reentrancy vulnerabilities...',
  'Analyzing access control patterns...',
  'Scanning for integer overflow risks...',
  'Evaluating gas optimization...',
  'Reviewing external call safety...',
  'Generating security report...',
];

export default function ScanLoader({ currentStep = 0 }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.orb}>
        <div className={styles.pulse} />
        <div className={styles.pulse} style={{ animationDelay: '0.4s' }} />
        <div className={styles.pulse} style={{ animationDelay: '0.8s' }} />
        <div className={styles.core} />
      </div>
      <p className={styles.stepText}>{STEPS[currentStep % STEPS.length]}</p>
      <div className={styles.dots}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
