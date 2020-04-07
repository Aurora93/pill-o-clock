import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 50,
    backgroundColor: '#fffdf9',
    borderRadius: 30,
    alignSelf: 'center',
  },

  titleText: {
    fontSize: 60,
    color: '#297885',
    fontFamily: 'Chocolate_DRINK_DEMO',
    alignSelf: 'center',
    padding: 30,
    textDecorationLine: 'underline',
  },
  
  plus : {
    margin : 20,
    width: 70,
    height: 70,
    alignSelf : 'center' 
  },

  logo : {
    width: 50,
    height: 50,
    marginLeft : 0,
    paddingTop: 10
  },

  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent : 'flex-start'
  },

  text: {
    fontFamily: 'Chocolate_DRINK_DEMO',
    fontSize: 30,
    color: '#297885',
    padding: 20

  },

  titleRight: {
    alignSelf: 'center',
    marginRight: 100
  }
})

export default styles
