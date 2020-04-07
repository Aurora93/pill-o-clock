
import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

import QR from 'react-native-qrcode-svg'
import QRCode from 'react-native-qrcode-svg'

const AddPatient: () => React$Node = ({user}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan this on your patient's phone to add him or her!</Text>
      <Text style={styles.text}>{user.name} {user.surname}, Pharmacist</Text>
     
      <QRCode
      value= {`${user.id.toString()}`}
      size={300}
    />
    </View>
  )
}

export default AddPatient