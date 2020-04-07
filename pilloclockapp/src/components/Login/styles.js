import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({

    container : {
        flex : 1,
        backgroundColor : '#fffdf9',
        borderRadius : 30,
        padding : 10
    },
    text : {
        textAlign: 'center'
    },
    
    input : {
        marginTop : 10,
        fontSize : 30,
       // justifyContent: 'center',
        alignSelf : 'center',
        alignItems: 'center',
        color:'#4CBBC2',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    title : {
        fontSize : 60,
        color : '#297885',
        alignSelf : 'center',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },
    
    button : {
        marginTop : 15,
        fontSize : 35,
        color : '#fffdf9',
        alignSelf : 'center',
        backgroundColor : '#297885',
        padding : 10,
        borderRadius : 10,
        overflow: 'hidden',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    toRegister : {
        marginTop : 20,
        fontSize : 25,
        alignSelf : 'center',
        color : '#79BABF',
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    error : {
        marginTop : 20,
        padding : 10,
        fontSize : 25,
        fontFamily : 'Chocolate_DRINK_DEMO'
    },

    logo : {
        width: 350,
        height: 350,
        alignSelf : 'center'
    }
})

export default styles