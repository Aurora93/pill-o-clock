import React, {useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Button } from 'react-native'
import styles from './styles'

function LandingPharmacist ({user, toPatients}) {
    

    return ( 
        <ScrollView>
            <View style={styles.container}>
            <Text style = {styles.text}>Welcome {user.name}!</Text>
            <Image style={styles.logo} source={require('../../../assets/images/pharmacist.png')}/>
                <Text style = {[styles.text, styles.button]} onPress={()=> toPatients()}>My patients</Text>

            </View>
        </ScrollView>
    )
}

export default LandingPharmacist