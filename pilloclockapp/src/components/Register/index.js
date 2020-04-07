import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Button, Picker, TouchableOpacity } from 'react-native'
import styles from './styles'

function Register ({onSubmit, onToLogin, error}) {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [gender, setGender] = useState('male')
    const [age, setAge] = useState()
    const [phone, setPhone] = useState('')
    const [profile, setProfile] = useState('patient')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    

    return (
        <ScrollView>
            <View style={styles.container}>
            
                <Text style = {[styles.text, styles.title]}>Register</Text>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Name' onChangeText = {text => setName(text)}/>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Surname' onChangeText = {text => setSurname(text)}/>
                <TextInput style = {[styles.text, styles.input]} keyboardType={'numeric'} placeholder= 'Age' onChangeText = {text => setAge(parseInt(text))}/>
                <TextInput style = {[styles.text, styles.input]} keyboardType={'numeric'} placeholder= 'Phone number' onChangeText = {text => setPhone(text)}/>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Email' onChangeText = {text => setEmail(text)}/>
                <TextInput style = {[styles.text, styles.input]} placeholder= 'Password' secureTextEntry={true} onChangeText= {text => setPassword(text)}/>
                <View style={styles.genderContainer}>
                    <View style={styles.genderTop}>
                        <Text style={[styles.genderText, styles.text, styles.input]}>Gender:</Text>
                    </View>
                    <View style={styles.genderOptions}>
                        {gender === 'male' ? (<TouchableOpacity>
                            <Text style={styles.genderOption}>Male</Text>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity onPress={() => {setGender('male')}}>
                            <Text style={styles.genderOptionLow}>Male</Text>
                        </TouchableOpacity>)}
                        {gender === 'female' ? (<TouchableOpacity>
                            <Text style={styles.genderOption}>Female</Text>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity onPress={() => {setGender('female')}}>
                            <Text style={styles.genderOptionLow}>Female</Text>
                        </TouchableOpacity>)}
                        {gender === 'non-binary' ? (<TouchableOpacity>
                            <Text style={styles.genderOption}>Non-binary</Text>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity onPress={() => {setGender('non-binary')}}>
                            <Text style={styles.genderOptionLow}>Non-binary</Text>
                        </TouchableOpacity>)}
                    </View>
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.profileTop}>
                        <Text style={[styles.genderText, styles.text, styles.input]}>Profile (Patient / Pharmacist)</Text>
                    </View>
                    <View style={styles.profileOptions}>
                        {profile === 'patient' ? (<TouchableOpacity>
                            <Image style={styles.profileImage} source={require('../../../assets/images/patient.png')}/>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity onPress={() => setProfile('patient')}>
                            <Image style={styles.profileImageLow} source={require('../../../assets/images/patient.png')}/>
                        </TouchableOpacity>)}
                        {profile === 'pharmacist' ? (<TouchableOpacity>
                            <Image style={styles.profileImage} source={require('../../../assets/images/pharmacist.png')}/>
                        </TouchableOpacity>)
                        :
                        (<TouchableOpacity onPress={() => setProfile('pharmacist')}>
                            <Image style={styles.profileImageLow} source={require('../../../assets/images/pharmacist.png')}/>
                        </TouchableOpacity>)}
                    </View>
                    
                 
                </View>

                {error && <Text style={[styles.text, styles.error]}>{error}</Text>}
                
                <Text style = {[styles.text, styles.button]} onPress={()=> onSubmit({name, surname, gender, age, phone, profile, email, password})}>Submit</Text>
            
                <Text style = {[styles.text, styles.toLogin]} onPress={()=>onToLogin()}>Are you already registered? Go to Login!</Text>
           
            
            </View>
            
        </ScrollView>

    )
}

//TODO gender, afe, profile


export default Register