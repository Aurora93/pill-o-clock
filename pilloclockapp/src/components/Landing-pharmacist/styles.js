import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({

    text : {
        fontFamily : 'Chocolate_DRINK_DEMO',
        color : '#297885',
        fontSize : 40,
        alignSelf : 'center'
    },

    container : {
        flex : 1,
        marginTop : 100,
        backgroundColor : '#fffdf9',
        borderRadius : 30,
        padding : 30
    },

    button : {
        marginTop : 20,
        fontSize : 40,
        color : '#fffdf9',
        alignSelf : 'center',
        backgroundColor : '#297885',
        padding : 25,
        borderRadius : 10,
        overflow: 'hidden'
    },
    logo : {
        marginTop : 10,
        width: 300,
        height: 300,
        alignSelf : 'center',
        resizeMode: 'contain'
        
    }
    
})

export default styles