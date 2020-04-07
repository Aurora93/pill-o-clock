import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    
    title2 : {
        fontFamily : 'Chocolate_DRINK_DEMO',
        color : '#297885',
        fontSize : 50,
        marginLeft : 20,
        marginTop : 10,
        
    },

    container : {
        flex : 1,
        //width : '100%',
        backgroundColor : '#fffdf9',
        borderRadius : 30,
        paddingBottom : '30%',
        padding: '7%',
        marginTop : '7%'
    },

    text : {
        fontFamily : 'Chocolate_DRINK_DEMO',
        color : '#4CBBC2',
        fontSize : 30,
        marginLeft : 50,
        marginTop : 10
    },
    
    logo : {
        marginTop : 20,
        width: 150,
        height: 150,
        alignSelf : 'center'   
    },

    link:{
        color : '#FC94AD'
    },

    title : {
        fontFamily : 'Chocolate_DRINK_DEMO',
        color : '#297885',
        fontSize : 60,
        textDecorationLine: 'underline',
        alignSelf: 'center',
        
    },

    bin : {
        flex: 1,
        padding: '3%'
    },
    logoBin : {
        resizeMode: 'contain',
        width: 40,
        height: 40,
        alignSelf: 'flex-end'
    },
    headerContainer : {
        alignItems:'center',
        flexDirection : 'row'
    }

})

export default styles