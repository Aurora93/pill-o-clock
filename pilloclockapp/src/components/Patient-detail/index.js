import React, {useState, useEffect} from 'react'
import logic, { retrievePatientInfo} from '../../logic';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity, AsyncStorage} from 'react-native'
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars'
import styles from './styles'
import moment from 'moment'


function Progress ({patient}) {
    const { name, surname, phone, email } = patient
    const [ markedDates, setMarketDates] = useState()

    function makeCall(){
        let phoneNumber =''
        if(Platform.OS === 'android'){
            phoneNumber =`tel:(+34)${phone}`
        }else{
            phoneNumber= `telprompt:(+34)${phone}`
        }
        Linking.openURL(phoneNumber)
    }


    function colorCheck (check) {
        let index
        if (check===1) return index = '#75cf67'
        else if (check <1 && check >= 0.75) return index= '#c6f186'
        else if (check < 0.75 && check > 0.5) return index = "#DBF186"
        else if (check === 0.5) return index ='#FFF881'
        else if (check < 0.5 && check >= 0.25) return index = "#FFBF84"
        else return check = 'F8764F'
    }

    async function calendar() {
        const patientId = patient.id

        let patientInfo = await retrievePatientInfo(patientId)

        const {progressPatient, progressRecordPatient } = patientInfo 

        let _markedDates = {}

        //today info
        let today = moment(new Date).format('YYYY-MM-DD')

        let checkToday = (progressPatient.reduce((accum, value) => accum + value, 0))/progressPatient.length
        
        let indexToday = colorCheck(checkToday)

        _markedDates[today] = { customStyles: { container: {backgroundColor: indexToday}, text: {color: 'black', fontWeight: 'bold'}}}
       
        //other days info

        progressRecordPatient.forEach(day => {
            _markedDates[day.date] = { customStyles: { container: {backgroundColor: day.record }, text: {color: 'black', fontWeight: 'bold'}}}
        })
   
        setMarketDates(_markedDates);
    }

    useEffect( ()=>{

        calendar()
        
    },[])

    return (<>
        
        <View style={styles.container}>
            <ScrollView >
                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle]}>Name: </Text>
                    <Text style={styles.text}>{name}</Text>
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle]}>Surname: </Text>
                    <Text style={styles.text}>{surname}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle]} >Phone: </Text>
                    <Text style={styles.text} onPress={() => makeCall()}>{phone}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.subtitle]}>Email: </Text>
                    <Text style={styles.text}>{email}</Text>
                </View>

                <Text style={styles.subtitle}>Progress:</Text>

                    <Calendar style= {styles.calendar}
                        // style={{
                        //     flex: 1,
                        //     borderWidth: 1,
                        //     borderColor: 'gray',
                        //     height: 350
                        // }}
                        // Specify theme properties to override specific styles for calendar parts. Default = {}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'orange',
                            disabledArrowColor: '#d9e1e8',
                            //monthTextColor: 'blue',
                            indicatorColor: 'blue',
                            textDayFontFamily: 'monospace',
                            textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 15,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 15
                        }}
                        onDayPress={(day) => {console.log('selected day', day)}}
                        // Handler which gets executed on day long press. Default = undefined
                        onDayLongPress={(day) => {console.log('selected day', day)}}
                        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        monthFormat={'MM yyyy'}
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(month) => {console.log('month changed', month)}}
                        
                        
                        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                        firstDay={1}
                        
                        // Show week numbers to the left. Default = false
                        showWeekNumbers={true}
                        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        onPressArrowLeft={substractMonth => substractMonth()}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        onPressArrowRight={addMonth => addMonth()}
                        
                        markedDates ={markedDates}

                        //markingType={'period'}
                        markingType={'custom'}
         
                    />
            </ScrollView>
        </View>
        
        
    </>)
}

export default Progress