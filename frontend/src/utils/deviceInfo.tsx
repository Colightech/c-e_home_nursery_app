import DeviceInfo from 'react-native-device-info';


const getDeviceInfo = () =>  {
  return {
    platform: DeviceInfo.getSystemName(),   // Android / iOS
    version: DeviceInfo.getSystemVersion(),
    deviceId: DeviceInfo.getDeviceId(),
  }
};


export default getDeviceInfo;