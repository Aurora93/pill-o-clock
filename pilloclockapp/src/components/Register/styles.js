import {StyleSheet} from 'react-native'


const styles = StyleSheet.create({

    container : {
        flex : 1,
        marginTop : 50,
        backgroundColor : '#fffdf9',
        borderRadius : 30,
        padding : 30,
        width: '95%',
        marginHorizontal: '2.5%'
    },
    
    input : {
        marginTop : 20,
        fontSize : 30,
        color:'#4CBBC2',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    title : {
        fontSize : 60,
        color : '#297885',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    button : {
        //marginTop : 35,
        fontSize : 35,
        color : '#fffdf9',
        alignSelf : 'center',
        backgroundColor : '#297885',
        padding : 10,
        borderRadius : 10,
        overflow: 'hidden',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    toLogin : {
        marginTop : 20,
        fontSize : 30,
        alignItems : 'center',
        color : '#79BABF',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    error : {
        fontSize: 25,
        marginTop : 20,
        padding : 10,
        fontFamily : 'Chocolate_DRINK_DEMO'
    },
    genderContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20 
    },
    profileContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20 
    },
    genderTop: {
        flex: 1
    },
    profileTop: {
        flex: 1
    },
    genderOptions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    profileOptions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    genderOption: {
        fontSize : 30,
        alignItems : 'center',
        color: 'white',
        backgroundColor : '#79BABF',
        fontFamily : 'Chocolate_DRINK_DEMO',
        padding: 10,
        borderRadius: 10
    },
    genderOptionLow: {
        fontSize : 30,
        alignItems : 'center',
        color: 'white',
        backgroundColor : '#79BABF',
        fontFamily : 'Chocolate_DRINK_DEMO',
        padding: 10,
        borderRadius: 10,
        opacity: 0.4
    },
    profileImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    profileImageLow: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        opacity: 0.3
    },
})

export default styles