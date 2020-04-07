import React from 'react'
import styles from './styles'
import { View, Text, Image, TouchableOpacity, Button, Alert, ImageBackground } from 'react-native'


function NavigationBarTop({ toLogin, toMedication, toProgress, toContacts, toPatients, user }) {
    return (
        <View style={styles.top}>
            <View style={styles.buttonTop}>
                <TouchableOpacity onPress={toLogin}>
                    <Image  style={styles.image} source={require('../../../assets/images/logout.png')}/>
                </TouchableOpacity>
            </View>
            {
                user.profile === 'patient' && (<>
                <View style={styles.buttonTop}>
                <TouchableOpacity onPress={toMedication}>
                    <Image  style={styles.image} source={require('../../../assets/images/pills.png')}/>
                </TouchableOpacity>
                </View>
                <View style={styles.buttonTop}>
                        <TouchableOpacity onPress={toProgress}>
                        <Image  style={styles.image} source={require('../../../assets/images/calendar.png')}/>
                        </TouchableOpacity>
                </View>
                <View style={styles.buttonTop}>
                        <TouchableOpacity onPress={toContacts}>
                        <Image  style={styles.image} source={require('../../../assets/images/contacts.png')}/>
                        </TouchableOpacity>
                </View>
                </>)
            }
            
            {
                user.profile === 'pharmacist' && (<>
                <View style={styles.buttonTop}>
                        <TouchableOpacity onPress={toPatients}>
                        <Image  style={styles.image} source={require('../../../assets/images/receipt.png')}/>
                        </TouchableOpacity>
                </View>
                </>)
            }
        </View>
    )

}

// import React from 'react'
// import { Text, TouchableOpacity } from 'react-native'
// import styles from './styles'

// export default function Button(props) {
//     return (
//         <TouchableOpacity style={styles[props.type]} onPress={props.onPress}>
//             <Text style={styles[props.textStyle]}>{props.text}</Text>
//         </TouchableOpacity>
//     )
// }

export default NavigationBarTop