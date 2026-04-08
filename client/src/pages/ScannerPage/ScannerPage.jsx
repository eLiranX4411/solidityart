import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScanLoader from '../../components/ScanLoader/ScanLoader';
import { submitScan } from '../../api/scan';
import styles from './ScannerPage.module.scss';

const PLACEHOLDER = `// Paste your Solidity contract here
// Example:
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount; // Bug: state updated after external call
    }
}`;

export default function ScannerPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const stepTimerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      stepTimerRef.current = setInterval(() => {
        setStep(s => s + 1);
      }, 2200);
    } else {
      clearInterval(stepTimerRef.current);
      setStep(0);
    }
    return () => clearInterval(stepTimerRef.current);
  }, [loading]);

  async function handleScan() {
    if (!code.trim()) {
      setError('Please paste or upload a Solidity contract before scanning.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const report = await submitScan(code);
      navigate('/report', { state: { report } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.sol')) {
      setError('Please upload a .sol Solidity file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target.result);
      setError('');
    };
    reader.readAsText(file);
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <ScanLoader currentStep={step} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <button className={`btn btn--ghost ${styles.back}`} onClick={() => navigate('/')}>
          ← Back
        </button>
        <span className={styles.logo}>SolidityArt</span>
      </nav>

      <div className={styles.content}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Scan Your Contract</h1>
          <p className={styles.subtitle}>Paste Solidity code or upload a .sol file</p>
        </div>

        <div className={styles.editorWrapper}>
          <div className={styles.editorToolbar}>
            <span className={styles.lang}>Solidity</span>
            <div className={styles.toolbarActions}>
              <span className={styles.charCount}>
                {code.length.toLocaleString()} / 50,000
              </span>
              <button
                className={`btn btn--ghost ${styles.uploadBtn}`}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload .sol
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".sol"
                className={styles.hiddenInput}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <textarea
            className={styles.textarea}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError('');
            }}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            maxLength={50000}
          />
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <span>⚠</span> {error}
          </div>
        )}

        <button
          className={`btn btn--primary ${styles.scanBtn}`}
          onClick={handleScan}
          disabled={!code.trim() || loading}
        >
          Scan Contract
        </button>
      </div>
    </main>
  );
}
