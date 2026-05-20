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
20. npm install multer cloudinary
21. npm install socket.io
22. npm install streamifier






# FRONTEND
1. npx @react-native-community/cli init frontend  
2. npm install react-native-device-info axios
3. npm install @react-native-async-storage/async-storage zustand
4. npm install @react-navigation/native  @react-navigation/native-stack  react-native-screens  react-native-safe-area-context
5. npm install react-native-vector-icons
6. npm install @react-native-picker/picker
7. npm install react-native-image-picker
8. npm install socket.io-client
9. npm install @react-native-documents/picker
10. npm install react-native-audio-recorder-player
11. npm install react-native-contacts
12. npm install react-native-geolocation-service
14. npm install react-native-video
15. npm install react-native-permissions
16. npm install react-native-nitro-sound
17. npm install react-native-nitro-modules
18. npm install @react-navigation/bottom-tabs
19. npm install @react-native-camera-roll/camera-roll react-native-fs
20. npm install react-native-date-picker

## NOT INSTALL YET
13. npm install react-native-maps
14. npm install react-native-dotenv
## npx react-native log-android




IN:
babel.config.js
Add:
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
  ],
};





API_URL=http://192.168.1.5:5000/api
SOCKET_URL=http://192.168.1.5:5000




How to use it
import { API_URL, SOCKET_URL } from "@env";




const xhr = new XMLHttpRequest();

xhr.open("POST", `${API_URL}/chat/upload`);


