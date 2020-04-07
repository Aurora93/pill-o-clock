import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Button } from 'react-native'
import styles from './styles'

function Login ({onSubmit, toRegister, error}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    return (
        <ScrollView>
        <Image style={styles.logo} source={require('../../../assets/images/logo.png')}/>
            <View style={styles.container}>
            
                <Text style = {[styles.text, styles.title]}>Login</Text>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Email' onChangeText = {text => setEmail(text)}/>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Password' secureTextEntry={true} onChangeText= {text => setPassword(text)}/>
                {error && <Text style={[styles.text, styles.error]}>{error}</Text>}
                <Text style = {[styles.text, styles.button]} onPress={()=> onSubmit({email, password})}>Submit</Text>
                <Text style = {[styles.text, styles.toRegister]} onPress={()=>toRegister()}>Are you not registered yet? Go to Register!</Text>
           
            
            </View>
        </ScrollView>
    )
}

export default Login