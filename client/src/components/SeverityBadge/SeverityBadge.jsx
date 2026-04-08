import styles from './SeverityBadge.module.scss';

export default function SeverityBadge({ severity }) {
  return (
    <span className={`${styles.badge} ${styles[severity.toLowerCase()]}`}>
      {severity}
    </span>
  );
}
