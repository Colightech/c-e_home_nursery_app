import DeviceInfo from 'react-native-device-info';

const deviceInfo = {
  platform: DeviceInfo.getSystemName(),   // Android / iOS
  version: DeviceInfo.getSystemVersion(),
  deviceId: DeviceInfo.getDeviceId(),
};


export default deviceInfo;