

const normalizeIp = (ip) => {
  if (!ip) return "unknown";
  return ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
};

const getClientIp = (req) => {
  if (!req) return "unknown";

  const rawIp =
    req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip;

  return normalizeIp(rawIp);
};

module.exports = getClientIp;