import rateLimit from 'express-rate-limit';

const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many scan requests from this IP. Maximum 5 scans per hour.',
  },
  keyGenerator: (req) => req.ip,
});

export default scanLimiter;
