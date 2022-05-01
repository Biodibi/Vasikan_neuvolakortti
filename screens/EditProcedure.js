import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable, Image, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { ref, update } from "firebase/database";
import Radiobutton from '../components/Radiobutton';
import styles from '../style';
import MicFAB from '../components/MicFAB';
import trashRed from '../icons/trash-red.png';

export default function Individual({navigation, route}) {
    const [index, setIndex] = useState(null);
    const [cowName, setCowName] = useState('');
    const [temperature, setTemperature] = useState('');
    const [procedures, setProcedures] = useState({});
    const [procedure, setProcedure] = useState('');
    const [procedureID, setProcedureID] = useState('');
    const [procedureIDs, setProcedureIDs] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

   
    useEffect(() => {
            if (route.params?.cow) {
                setCowName(route.params?.cow.name);
                setTemperature(route.params?.cow.temperature);
                setProcedureID(route.params?.procedureID);
                setProcedure(route.params?.cow.procedures[route.params?.procedureID].description);
                setTime(route.params?.cow.procedures[route.params?.procedureID].time);
                setDate(route.params?.cow.procedures[route.params?.procedureID].date);
                setProcedures(route.params?.cow.procedures);
                setProcedureIDs(route.params?.procedureIDs);
                setIndex(route.params?.key);
            } else {
                Alert.alert("Virhe","Vasikan tietojen haku epäonnistui.",[{ text: "OK", onPress: () => navigation.navigate("Home") }]);
            }
        }, [])
    

        function saveChanges() {
            let saveData = {
                description: procedure,
                date: date,
                time: time
            }
            update(ref(db, ROOT_REF + route.params?.cowID + "/procedures/" + procedureID), saveData)
        .then(() => {
            navigation.navigate('Home'); // Data saved successfully!
          })
          .catch((error) => {
            alert (error)   // The write failed...
          })
        }

        const confirmBeforeRemove = () => Alert.alert(
            "Toimenpiteen poistaminen", "Oletko varma, että haluat poistaa tiedot tästä toimenpiteestä?", 
            [
              {
                text: "Ei, älä poista."},
              {
                text: "Kyllä, poista.", onPress: () => removeThisProcedure()
              }
          ],
          {cancelable: false}
          );
        
        
        function removeThisProcedure() {
            if (procedureIDs.length === 1) {
            // If the only procedure is going to be deleted, the procedures-node must be changed to empty string to avoid errors
            let saveData = JSON.parse(JSON.stringify({procedures: ""}));
            update(ref(db, ROOT_REF + route.params?.cowID), saveData);
        } else {
            // when there are other procedures also, an individual procedure can be deleted with remove()
            db.ref(ROOT_REF + route.params?.cowID + "/procedures/" + procedureID).remove();
            }
            navigation.navigate('Home');
        }
        

    return (
        <View style={styles.main}>

            <View style={styles.titleRow}>            
                <Text style={styles.header}># {route.params?.cowID}</Text>

            </View>

        

                <TextInput style={styles.textInput} placeholderTextColor='#a3a3a3' 
                placeholder='Vapaa kuvaus ...' value={procedure} multiline={true}
                onChangeText={setProcedure} />
           
           
        
            
        <TouchableOpacity style={styles.customButton} onPress={() => saveChanges()}>
            <Text style={styles.buttonText}>Tallenna muutokset</Text>
        </TouchableOpacity>    

        <TouchableOpacity style={styles.grayButton} onPress={() => confirmBeforeRemove()}>
            <Image source={trashRed} style={{height: 20, width: 20}} />
            <Text style={{marginLeft: 5,fontSize: 15, color: '#8c0010'}} >Poista tämä toimenpide</Text>
        </TouchableOpacity>
            
            <MicFAB title="microphone-on" onPress={() => alert('Pressed Microphone')} />

        </View>
    )
}

