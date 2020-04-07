
// // IDEA

// // inside interval
// let date = AsyncStorage.getItem('date')
// date && (date = moment(date))

// let alarms = await AsyncStorage.getItem('alarms')
// alarms && (alarms = JSON.parse(alarms))

// if (/* current date is greater that date */) {
//   await AsyncStorage.setItem('date', moment().format('yyyyMMdd'))
//   // reset alarms and in AsyncStorage
// }

// alarms = {
//   'id-med-1' : {
//     '1000': false, 
//     '1215': false, 
//     '1745': false
//   },
//   'id-med-2' : {
//     '1100': false, 
//     '1215': false, 
//     '1845': false
//   }
// }

// alarms.forEach(/* check time and launch alarms => alarms[med][time] = true */)

// await AsyncStorage.setItem('alarms', JSON.stringify(alarms))


// const alarms = await checkAlarms()

// alarms.forEach(/* shoot alarms */)


// // when retrieving medications

// const medicaments = await retrieveMedications()

// // sync alarms in async-storage



// //LO QUE TENIA ANTES
// // useEffect(()=>{
// //     //if(user) {
// //       const interval = setInterval(async () => { 
// //         let schedule = await getAlarms(token)
// //         if(schedule.length){
// //           //console.log(schedule)
// //           schedule.forEach(prescription => {
// //             prescription.times.forEach(alarm => {
             
// //               let time =alarm.time.toString()
// //               let min = parseInt(time.slice(time.length-2, time.length))
// //               let hour = parseInt(time.slice(0, time.length-2))

// //               let now = new Date()
// //               let hour2 = now.getHours()
// //               let min2 = now.getMinutes()
// //               if(hour === hour2 && min >= min2 ) {
// //                 //alarm.sounded=true 
// //                 pushNotification.localNotification(prescription.drugName)
// //               }
// //             })

// //           })

// //         }


// //       }, 60000)
  
// //     return () => clearInterval(interval)
// //   }, [schedule])

// // async function getAlarms (token) {
// //     const _medication = await retrieveMedication(token)
// //     //console.log(_medication)

// //     if(_medication.length) {
// //       let _schedule = []
// //       for( let i=0; i<_medication.length; i++) {
// //         _schedule[i] = {}
// //         _schedule[i].drugName = _medication[i].drug.drugName
// //         _schedule[i].times= []
// //         for (let j=0; j<_medication[i].times.length; j++){
// //           _schedule[i].times.push({time: _medication[i].times[j], sounded: false})
// //         }
        
// //       }
// //       //console.log(_schedule[0].times)
// //       // return _schedule
// //       setSchedule(_schedule)
// //     }
// //   }