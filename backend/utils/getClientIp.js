
const getClientIp = (req) => {
  if (!req) return;

  return (
    req.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

module.exports = getClientIp;