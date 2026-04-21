
// const getClientIp = (req) => {
//   if (!req) return;

//   return (
//     req.headers?.["x-forwarded-for"]?.split(",")[0] ||
//     req.socket?.remoteAddress ||
//     req.ip ||
//     "unknown"
//   );
// };




const getClientIp = (req) => {
  if (!req) return "unknown";

  return (
    req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};


module.exports = getClientIp;