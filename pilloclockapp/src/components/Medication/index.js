import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Button, FlatList, TouchableOpacity, Alert} from 'react-native'
import {List, ListItem } from 'react-native-elements'
import styles from './styles'

function Medication ({medication, toAdd, onDrug}) {

    return (
        <View style={{width : '100%'}}>
        <ScrollView>
            <View style={styles.container}>

                <View style ={styles.titleContainer}>
                    <View style={styles.titleLeft}>
                        <Text style={styles.title}>My medication</Text>
                    </View>
                    <View style={styles.titleRight}>
                        <Image style={styles.logo} source={require('../../../assets/images/pills.png')}/>
                    </View>
                </View>
                    {
                    medication.length > 0 ? 
                    <FlatList 
                        style={styles.list}
                        data = {medication}
                        renderItem={({item})=>(
                            <ListItem 
                                onPress ={()=> {
                                    const {drug: {drugName, _id: id}, times} = item
                                    onDrug({id, times})
                                }}
                                title ={item.drug.drugName.toString()}
                                titleStyle = {{
                                    fontSize : 35,
                                    color : '#fffdf9',
                                    alignSelf : 'center',
                                    backgroundColor : '#297885',
                                    padding : 15,
                                    borderRadius : 10,
                                    overflow: 'hidden',
                                    fontFamily : 'Chocolate_DRINK_DEMO'
                                }}
                            />
                        )}
                        keyExtractor={item => item.drug}
                    />
                :
                    <Text style={styles.text}>You don't have medication yet! Do you want to add one?</Text>
                
                }

                <TouchableOpacity onPress={()=>toAdd()}>
                <Image style={styles.plus} source={require('../../../assets/images/plus.png')}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </View>
        
    )
}

export default Medication