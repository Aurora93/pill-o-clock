import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    backgroundColor: '#fffdf9',
    borderRadius: 30,
    alignSelf: 'center',
  },

  titleText: {
    fontSize: 60,
    color: '#297885',
    fontFamily: 'Chocolate_DRINK_DEMO',
    alignSelf: 'center',
    padding: 50,
    textDecorationLine: 'underline',
  },

  logo : {
    width: 80,
    height: 80
  },

  calendar: {
    paddingBottom: 30
  },

  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  titleRight: {
    alignSelf: 'center',
    marginRight: 60
  }
})

export default styles
