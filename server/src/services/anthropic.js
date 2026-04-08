import Anthropic from '@anthropic-ai/sdk';
import logger from '../config/logger.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert Solidity smart contract security auditor.
Analyze the provided Solidity code and return ONLY a valid JSON object — no markdown, no explanation, no code fences.
The JSON must conform exactly to this structure:
{
  "score": <integer 0-100, where 100 is perfect security>,
  "summary": "<2-3 sentences summarising the contract's overall security posture>",
  "issues": [
    {
      "id": "<short unique slug, e.g. REENTRANCY-1>",
      "severity": "<Critical|High|Medium|Low|Info>",
      "title": "<short issue title>",
      "description": "<plain English explanation, no jargon>",
      "vulnerableCode": "<the exact vulnerable code snippet>",
      "fixedCode": "<the corrected code snippet>",
      "explanation": "<why the fix resolves the vulnerability>"
    }
  ],
  "positives": ["<things the contract does well>"]
}

Severity definitions:
- Critical: can lead to total loss of funds or complete contract takeover
- High: significant risk of asset loss or privilege escalation
- Medium: logic errors or moderate risk with limited impact
- Low: best-practice violations or minor inefficiencies
- Info: informational notes, style suggestions

Return ONLY the JSON object. No other text.`;

export async function analyzeContract(code) {
  logger.info('Sending contract to Anthropic for analysis');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analyze this Solidity contract:\n\n${code}`,
      },
    ],
  });

  const raw = message.content[0]?.text?.trim();
  if (!raw) {
    throw new Error('Empty response from Anthropic');
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch {
    logger.error('Failed to parse Anthropic response as JSON:', raw.slice(0, 200));
    throw new Error('AI returned malformed JSON');
  }

  // Basic shape validation
  if (typeof report.score !== 'number' || !Array.isArray(report.issues)) {
    throw new Error('AI response is missing required fields');
  }

  return report;
}
