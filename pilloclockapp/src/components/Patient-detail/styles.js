import {StyleSheet, Dimensions} from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginTop: 50,
    backgroundColor: '#fffdf9',
    borderRadius: 30,
  },

  subtitle : {
    fontFamily : 'Chocolate_DRINK_DEMO',
    color : '#297885',
    fontSize : 35,
    marginLeft : 20,
    marginTop : 10,
    
  },
  text : {
    fontFamily : 'Chocolate_DRINK_DEMO',
    color : '#4CBBC2',
    fontSize : 35,
    marginTop : 10,
    
  },
  calendar: {
    paddingBottom: 30
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
    
})

export default styles
