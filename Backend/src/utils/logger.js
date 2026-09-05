export const logger = {
  info: (msg, meta = '') => {
    console.log(`[${new Date().toISOString()}] [INFO] ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${msg}`, meta ? meta : '');
  },
  error: (msg, err = '') => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${msg}`, err ? err : '');
  },
  agent: (stage, msg, meta = '') => {
    console.log(`[${new Date().toISOString()}] [AGENT:${stage}] ${msg}`, meta ? meta : '');
  },
};
