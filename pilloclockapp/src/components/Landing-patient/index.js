import React, {useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Button } from 'react-native'
import styles from './styles'

function LandingPatient ({toMedication, toProgress, toContacts, user}) {

    return ( 
        <ScrollView>
            <View style={styles.container}>
            <Text style = {styles.text}>Welcome {user.name}!</Text>
            <Image style={styles.logo} source={require('../../../assets/images/patient.png')}/>
                <Text style = {[styles.text, styles.button]} onPress={()=> toMedication()}>My medication</Text>
                <Text style = {[styles.text, styles.button]} onPress={()=> toProgress()}>My progress</Text>
                <Text style = {[styles.text, styles.button]} onPress={()=> toContacts()}>My contacts</Text>

            </View>
        </ScrollView>
    )
}

export default LandingPatient