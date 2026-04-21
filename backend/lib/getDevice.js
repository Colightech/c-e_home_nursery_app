
// const getDevice = (req) => {
//   return {
//   platform: req.headers["x-platform"] || "unknown",
//   appVersion: req.headers["x-app-version"] || "unknown",
//   deviceId: req.headers["x-device-id"] || null
//   };
// };


const getDevice = (req) => ({
  platform: req.headers["x-platform"] || "unknown",
  appVersion: req.headers["x-app-version"] || "unknown",
  deviceId: req.headers["x-device-id"] || null
});


module.exports = getDevice;