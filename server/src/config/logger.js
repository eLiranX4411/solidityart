const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = process.env.NODE_ENV === 'production' ? 1 : 3;

const format = (level, ...args) => {
  const ts = new Date().toISOString();
  process.stdout.write(`[${ts}] [${level.toUpperCase()}] ${args.join(' ')}\n`);
};

const logger = {
  error: (...args) => LEVELS.error <= currentLevel && format('error', ...args),
  warn:  (...args) => LEVELS.warn  <= currentLevel && format('warn',  ...args),
  info:  (...args) => LEVELS.info  <= currentLevel && format('info',  ...args),
  debug: (...args) => LEVELS.debug <= currentLevel && format('debug', ...args),
};

export default logger;
