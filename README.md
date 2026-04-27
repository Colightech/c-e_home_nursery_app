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
1. npx @react-native-community/cli init frontend  
2. npm install react-native-device-info axios
3. npm install @react-native-async-storage/async-storage zustand
4. npm install @react-navigation/native  @react-navigation/native-stack  react-native-screens  react-native-safe-area-context
## npx react-native log-android








await axios.post("/api/register", data, {
  headers: {
    "x-platform": deviceInfo.platform,
    "x-app-version": deviceInfo.servion,
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