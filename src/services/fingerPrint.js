import crypto from 'crypto'

export function generateFingerprint(req) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];
    const data = `${ip}-${userAgent}-${acceptLanguage}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
