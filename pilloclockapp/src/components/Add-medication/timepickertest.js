import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Picker } from "react-native";
import TimePicker from "react-native-24h-timepicker";
 
export default class AddMedication extends Component {
  //constructor() {
    //super();
    state = {
      time: "",
      drug:""
    }
  //}

  updateDrug = (drug) => {
      this.setState({ drug: drug })
   }
 
  onCancel() {
    this.TimePicker.close();
  }
 
  onConfirm(hour, minute) {
    this.setState({ time: `${hour}:${minute}` });
    this.TimePicker.close();
  }
 
  render() {
    return (<>
      <View style={styles.container}>
        
          <Text >Add medication</Text>
          <Text style={styles.text}>Select name: </Text>

          
          <Picker selectedValue={this.state.drug} onValueChange={ this.updateDrug}>
               <Picker.Item label="Furosemide" value="furosemide" />
               <Picker.Item label="Adiro" value="adiro" />
               <Picker.Item label="Atorvastatine" value="atorvastatine" />
          </Picker>
          <Text style = {styles.text}>{this.state.drug}</Text>
          
      

        <TouchableOpacity
          onPress={() => this.TimePicker.open()}
          style={styles.button}>
          <Text style={styles.buttonText}>Select time</Text>
        </TouchableOpacity>

        <Text style={styles.text}>{this.state.time}</Text>

        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />
      </View>
    
    </>);
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 100,
    width: '100%'
  },
  picker : {
    backgroundColor : 'red'
  },

  text: {
    fontSize: 20,
    marginTop: 10
  },
  button: {
    backgroundColor: "#4EB151",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});