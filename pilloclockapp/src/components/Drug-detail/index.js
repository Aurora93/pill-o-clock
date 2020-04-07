import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Button, TouchableOpacity, Linking} from 'react-native'
import styles from './styles'

function DrugDetail ({drugDetail, times, toDelete }){
    const {drugName, id, description, link} = drugDetail
    
    return (<>
    <ScrollView>
        <View style = {styles.container}>
            <View style={styles.headerContainer}>
                <Text style ={styles.title}>{drugName}</Text>
                    <TouchableOpacity style={styles.bin} onPress={()=>toDelete({id})}>
                        <Image style={styles.logoBin} source={require('../../../assets/images/bin.png')}/>
                    </TouchableOpacity>
            </View>
            <Text style ={styles.title2}>Alarm at: </Text>
            {times.length && 
                times.map(time => {
                    if (time.toString().length === 3) {
                        time=`0${time}`
                    } else {
                        time = time.toString()
                    }
                    time = (time.slice(0, time.length-2) + ':' + time.slice(time.length-2, time.length))
                    return (<Text style ={styles.text} >{time}</Text>)
                })
            }
            <Text style ={styles.title2}>Description: </Text> 
                <Text style ={styles.text}>{description}</Text>

            <Text style ={styles.text}>Link for official prospect: </Text>
               {/* <Text style ={styles.text} onPress={() => Linking.openURL(link)}> </Text> */}
               <TouchableOpacity onPress={() => Linking.openURL(link)}>
                <Text style ={[styles.text, styles.link]}>
                    {link}
                </Text>
                </TouchableOpacity>
                {/* <Text style ={styles.text}>{link}</Text> */}
                
            <Image style={styles.logo} source={require('../../../assets/images/pill-and-clock.png')}/>  
        </View>
    </ScrollView>
  </> )
}

export default DrugDetail