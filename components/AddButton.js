import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import plus from '../icons/plus.png';

export default function AddButton() {
    const navigation = useNavigation();
    return(
        <TouchableOpacity style={styles.AddButton} onPress={() => navigation.navigate('NewCow')}>     
            <Image source={plus} style={styles.plusIcon}/>   
            {/* <Text style={styles.plus}>+ </Text>
            <Text style={styles.text}>Lisää uusi</Text> */}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    AddButton: {
        flexDirection: 'row',
      //  backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        color: '#2e2e2e'
    },  
    text: {
        color: '#2e2e2e',
    },
    plus: {
        color: '#2e2e2e',
        fontWeight: 'bold',
    },
    plusIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#66c257',
        borderRadius: 25
    }
})