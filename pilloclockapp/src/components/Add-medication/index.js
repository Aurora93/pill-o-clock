import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Button, Picker } from 'react-native'
//import TimePicker from 'react-time-picker'
import styles from './styles'

function AddMedication ({onSubmit, error, drugs}) {
    const [ drug, setDrug ] =useState(drugs[0].id.toString())
    const [ hour1, setHour1 ] = useState()
    const [ min1, setMin1 ] = useState()
    const [ secondTime, setSecondTime ] =useState(false)
    const [ hour2, setHour2 ] = useState()
    const [ min2, setMin2 ] = useState()
    const [ thirdTime, setThirdTime ] =useState(false)
    const [ hour3, setHour3 ] = useState()
    const [ min3, setMin3 ] = useState()
    
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style = {styles.title}>Add medication</Text>
                <Text style = {styles.text}>Select name: </Text>

                <View style={{width: 150, marginLeft: 50}}>
                <Picker style={{ height: 100}} itemStyle={{ height: 100, color:'#4CBBC2', fontFamily:'Chocolate_DRINK_DEMO'}} selectedValue = {drug} onValueChange = {setDrug}>
                    {drugs.map(drug => {
                        return <Picker.Item label = {drug.drugName} value = {drug.id.toString()}/>
                    })}
                </Picker>

                </View>

                <View style={styles.hourContainer}>                
                    <Text style = {styles.text}>Select hour: </Text> 
                    <TextInput keyboardType={'numeric'} style = {styles.hour} maxLength={2} placeholder='hour'
                        onChangeText={(hour1) => setHour1(hour1)}/>

                    <TextInput keyboardType={'numeric'}  style = {styles.hour} maxLength={2} placeholder='min'
                        onChangeText={(min1) => setMin1(min1)}/>

                    <Text style = {styles.add} onPress={() => setSecondTime(!secondTime)}>+/-</Text>
                </View>

                

                {secondTime && 
                <View style={styles.hourContainer}>                
                    <Text style = {styles.text}>Select hour: </Text> 
                    <TextInput keyboardType={'numeric'} style = {styles.hour} maxLength={2} placeholder='hour'
                        onChangeText={(hour2) => setHour2(hour2)}/>

                    <TextInput keyboardType={'numeric'} style = {styles.hour} maxLength={2} placeholder='min'
                        onChangeText={(min2) => setMin2(min2)}/>
                    <Text style = {styles.add} onPress={() => setThirdTime(!thirdTime)}>+/-</Text>
                </View>}

                {thirdTime && 
                <View style={styles.hourContainer}>                
                    <Text style = {styles.text}>Select hour: </Text> 
                    <TextInput keyboardType={'numeric'} style = {styles.hour} maxLength={2} placeholder='hour'
                        onChangeText={(hour3) => setHour3(hour3)}/>

                    <TextInput keyboardType={'numeric'} style = {styles.hour} maxLength={2} placeholder='min'
                        onChangeText={(min3) => setMin3(min3)}/>
                    
                </View>}


                {error && <Text style={ styles.error}>{error}</Text>}
                
                <Text style = {[styles.text, styles.button]} onPress={()=> {
                    !secondTime && onSubmit({drug, hour1, min1}) || 
                    secondTime && !thirdTime && onSubmit({drug, hour1, hour2, min1, min2}) || 
                    thirdTime && onSubmit({drug, hour1, hour2, hour3, min1, min2, min3})
                    
                }}>Add pill!</Text>
                       
            </View>
        </ScrollView>
    )
}

export default AddMedication