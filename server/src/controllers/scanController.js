import crypto from 'crypto';
import { analyzeContract } from '../services/anthropic.js';
import Scan from '../models/Scan.js';
import logger from '../config/logger.js';

export async function scan(req, res) {
  const { code } = req.body;

  const codeHash = crypto.createHash('sha256').update(code).digest('hex');
  logger.info(`Scan requested — hash: ${codeHash.slice(0, 12)}...`);

  try {
    const report = await analyzeContract(code);

    await Scan.create({ codeHash, report });
    logger.info(`Scan stored — hash: ${codeHash.slice(0, 12)}...`);

    return res.status(200).json({ report });
  } catch (err) {
    logger.error('Scan failed:', err.message);
    return res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
}
