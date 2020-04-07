import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({

    top: {
        width: '100%',
        flex: 0.09,
        height: Dimensions.get('window').height,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 5,
        backgroundColor: '#297885',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.9,
        shadowRadius: 1.84,
        elevation: 10
    },
    logoutContainer: {
        flex: 1,
        padding: 10
    },
    pillsContainer: {
        flex: 1,
        padding: 10
    },
    calendarContainer: {
        flex: 1,
        padding: 10
    },
    contactsContainer: {
        flex: 1,
        padding: 10
    },
    patientContainer: {
        flex: 1,
        padding: 10
    },

    image : {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    buttonTop: {
        flex: 0.25
    }

    // pills: {
    //     flex: 1,
    //     resizeMode: 'contain',
    //     alignSelf: 'center'
    // },
    // calendar: {
    //     flex: 1,
    //     resizeMode: 'contain',
    //     alignSelf: 'center'
    // },
    // contacts: {
    //     flex: 1,
    //     resizeMode: 'contain',
    //     alignSelf: 'center'
    // },
    // logout: {
    //     flex: 1,
    //     resizeMode: 'contain',
    //     alignSelf: 'center'
    // }

})

export default styles
