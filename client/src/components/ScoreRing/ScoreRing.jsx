import { useEffect, useRef } from 'react';
import styles from './ScoreRing.module.scss';

const SIZE = 180;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(score) {
  if (score >= 80) return '#06d6a0';
  if (score >= 60) return '#ffd166';
  if (score >= 40) return '#ff8c42';
  return '#ff4d4d';
}

export default function ScoreRing({ score }) {
  const progressRef = useRef(null);

  useEffect(() => {
    if (!progressRef.current) return;
    const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
    progressRef.current.style.strokeDashoffset = offset;
  }, [score]);

  const color = getColor(score);

  return (
    <div className={styles.wrapper}>
      <svg width={SIZE} height={SIZE} className={styles.svg}>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(234, 224, 213, 0.08)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          ref={progressRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className={styles.progress}
          style={{ '--color': color }}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.score} style={{ color }}>{score}</span>
        <span className={styles.outOf}>/100</span>
      </div>
    </div>
  );
}
