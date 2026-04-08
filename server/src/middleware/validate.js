const MAX_CODE_LENGTH = 50_000;

export function validateScanInput(req, res, next) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Request body must include a "code" string.' });
  }

  const trimmed = code.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Contract code cannot be empty.' });
  }

  if (trimmed.length > MAX_CODE_LENGTH) {
    return res.status(400).json({
      error: `Contract code exceeds maximum length of ${MAX_CODE_LENGTH.toLocaleString()} characters.`,
    });
  }

  // Attach sanitized value
  req.body.code = trimmed;
  next();
}
