import PushNotification from 'react-native-push-notification'
import PushNotificationAndroid from 'react-native-push-notification'
import { PushNotificationIOS, DeviceEventEmitter, AsyncStorage } from 'react-native'
import logic, {addProgress} from './src/logic'

logic.__context__.storage =AsyncStorage 

const configure = () => {
 PushNotification.configure({

   onNotification: async function(notification) {
     notification.finish(PushNotificationIOS.FetchResult.NoData)
     
     if (notification.action == "Take pill") {
        await addProgress(true)
      }
      else if (notification.action == "Did not take pill") {
        await addProgress(false)
      }
  },

   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,
   

 })
 
}


const localNotification = (drugName) => {
 PushNotification.localNotification({
   autoCancel: true,
   actions: `["Take pill", "Did not take pill"]`,
   largeIcon: "ic_launcher",
   smallIcon: "ic_notification",
   bigText: "Hey! You have to take take your medicine",
   //subText: "This is a subText",
   color: "green",
   //vibrate: true,
   //vibration: 300,
   title: drugName,
   message: "Take pill!",
   playSound: true,
   soundName: 'default',
   alertAction: 'view',
 })
}


export default {
 configure,
 localNotification
}
