# c-e_home_nursery_app


# BACKEND
1. npm init
2. npm i express express-fileupload express-openid-connect express-session mongodb validator dotenv mongoose jsonwebtoken cookie-parser bcrypt nodemon -D cors crypto
7. npm i cloudinary
12. npm i helmet
13. npm install axios dotenv
14. npm install node-cron nodemailer
15. npm install mime-types
16. npm i multer
17. npm install ua-parser-js
18. npm install natural
19. npm install natural spelling-corrector @xenova/transformers






# FRONTEND
npm install react-native-device-info



import DeviceInfo from 'react-native-device-info';

const deviceInfo = {
  platform: DeviceInfo.getSystemName(),   // Android / iOS
  version: DeviceInfo.getSystemVersion(),
  deviceId: DeviceInfo.getDeviceId(),
};




await axios.post("/api/register", data, {
  headers: {
    "x-platform": deviceInfo.platform,
    "x-device-id": deviceInfo.deviceId,
  }
});


await axios.post("/api/register", data, {
headers: {
  "x-platform": "android",
  "x-app-version": "1.0.0",
  "x-device-id": "...",
}
});