import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { ref, update } from "firebase/database";
import Radiobutton from '../components/Radiobutton';
import styles from '../style';
import MicFAB from '../components/MicFAB';
import trashRed from '../icons/trash-red.png';
import sort from '../icons/sort.png';

export default function Individual({navigation, route}) {
    const [index, setIndex] = useState(null);
    const [cowName, setCowName] = useState('');
    const [temperature, setTemperature] = useState('');
    const [procedures, setProcedures] = useState({});
    const [newProcedureDesc, setNewProcedureDesc] = useState('');
    const timestampUnix = Date.now();
    const dateObject = new Date(timestampUnix);
    const time = dateObject.toLocaleTimeString().substring(0, 5);
    const month = dateObject.getMonth()+1;
    const date = dateObject.getDate()+"."+month+"."+dateObject.getFullYear();
    const [newFirst, setNewFirst] = useState(true);

    // const [trembling, setTrembling] = useState(null);
    // const tremblingOptions = [
    //     {label: 'Yes', value: true},
    //     {label: 'No', value: false}
    //   ]; //Need to find a way to not have to repeat the options on every screen
   
    useEffect(() => {
            if (route.params?.cow) {
                setCowName(route.params?.cow.name);
                setTemperature(route.params?.cow.temperature);
                setProcedures(route.params?.cow.procedures);
                setIndex(route.params?.key);
            } else {
                Alert.alert("Virhe","Vasikan tietojen haku epäonnistui.",[{ text: "OK", onPress: () => navigation.navigate("Home") }]);
            }
        }, [])
    
      let procedureIDs = Object.keys(procedures).reverse(); //new entries first
      let procedureIDsAsc = Object.keys(procedures); //old entries first


    function saveChanges() {
        let upToDateProcedures = procedures;
        let saveData = {};
        let temperatureFormatted = temperature.toString().replace(/,/g, '.');
        // Json parse used to prevent sending undefined values to database (undefined is not allowed)
        if (procedures && newProcedureDesc) { 
            // if user logged new procedure while editing AND prev. procedures exist
            let proceduresToArray = Array.from(procedures);
            proceduresToArray.splice(procedures.length, 0, {description:newProcedureDesc, time: time, date:date});  
            saveData = JSON.parse(JSON.stringify({ 
                name: cowName,
                temperature: temperatureFormatted,
                procedures: proceduresToArray
              }))
       
        } else if (!procedures && newProcedureDesc) { // ok
            // prev. procedures do not exist BUT user logged the first one now
            upToDateProcedures = {
                1: {
                 description: newProcedureDesc,
                 date: date,
                 time: time
                }}; 
                saveData = JSON.parse(JSON.stringify({ 
                    name: cowName,
                    temperature: temperatureFormatted,
                    procedures: upToDateProcedures
                  }))
        } else if (procedures && !newProcedureDesc) {
            saveData = JSON.parse(JSON.stringify({ 
                name: cowName,
                temperature: temperatureFormatted,
                procedures: procedures
              }))
        } else {
            saveData = JSON.parse(JSON.stringify({ 
                name: cowName,
                temperature: temperatureFormatted,
                procedures: ""
              }))
        } // 
        update(ref(db, ROOT_REF + index), saveData)
        .then(() => {
            navigation.navigate('Home'); // Data saved successfully!
          })
          .catch((error) => {
            alert (error)   // The write failed...
          });
          
    }
    
     // asking for confirmation first before removing calf
  const confirmBeforeRemove = () => Alert.alert(
    "Tietojen poistaminen", "Oletko varma, että haluat poistaa vasikan #"+index+ " tietokannasta?", 
    [
      {
        text: "Ei, älä poista.",
        onPress: () => console.log('Cancel pressed'),
      },
      {
        text: "Kyllä, poista.", onPress: () => removeThisCow()
      }
  ],
  {cancelable: false}
  );


      function removeThisCow() {
        db.ref(ROOT_REF + index).remove();
        navigation.navigate('Home');
        // navigation.goBack();

        return;
      }

      function toggleOrder() {
          setNewFirst(!newFirst);
      }

    return (
        
        <View style={styles.main}>
                <View style={styles.titleRow}>            
                    <Text style={styles.header}>Vasikka #{index}</Text>
                    <TouchableOpacity onPress={() => confirmBeforeRemove()} style={{flexDirection:'row',justifyContent: 'flex-end',position: "absolute", right: 10,}}>
                        <Image source={trashRed} style={{height: 20, width: 20}} />
                        <Text style={{marginLeft: 5,fontSize: 15, color: '#8c0010'}} >Poista vasikka</Text>
                    </TouchableOpacity>
                </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    <Text style={styles.textInputLabel}>Nimi</Text>
                        <TextInput style={styles.textInput} placeholderTextColor='#a3a3a3' 
                            placeholder='Vasikan nimi (valinnainen)'
                            value={cowName} onChangeText={setCowName}/>

                        <Text style={styles.textInputLabel}>Ruumiinlämpö (°C)</Text>
                        <TextInput style={styles.textInput} placeholderTextColor='#a3a3a3' 
                            placeholder='Vasikan ruumiinlämpö (valinnainen)' value={temperature}
                            onChangeText={setTemperature} keyboardType='numeric' />

                        <Text style={styles.textInputLabel}>Toimenpiteet</Text>
                        <Text>➥ Uusi toimenpide   {date}, {time}</Text>

                        <TextInput style={styles.textInput} placeholderTextColor='#a3a3a3' 
                            placeholder='Vapaa kuvaus ...' value={newProcedureDesc}
                            onChangeText={setNewProcedureDesc} multiline={true}/>
                </View>
                </TouchableWithoutFeedback>

            {procedures ? // Procedures have been logged before
            <>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: 'black'}}>Aiemmat toimenpiteet ({procedureIDs.length})</Text>
                <TouchableOpacity style={{right: 10, position: 'absolute', flexDirection: 'row'}} onPress={() => toggleOrder()}>
                <Image source={sort} style={{height: 15, width: 15}} />
                    <Text style={styles.textInputLabel}>{newFirst ? "  Uusin ensin" : "  Vanhin ensin"}</Text>
                </TouchableOpacity>
            </View>
        <View style={{maxHeight: '40%'}}>
        <ScrollView style={styles.procedureList}>
            {newFirst ? 
        //   <ScrollView style={styles.procedureList}>
              <>
                {procedureIDs.map(key => ( 
                
            <View key={key} style={{marginBottom: 10}}>
                <View 
                    style={{flexDirection: 'row', paddingVertical: 5, paddingLeft: 5}}>
                    <View style={{width: '75%'}}>
                        <Text style={{fontStyle: 'italic'}}>{procedures[key].date}, {procedures[key].time}</Text>
                       
                    </View>
                    <TouchableOpacity style={styles.editProcedureText}
                        onPress={() => navigation.navigate('EditProcedure', {procedureIDs: procedureIDs,cow: route.params?.cow, cowID: index, procedureID: key})}>
                        <Text>Muokkaa</Text>
                    </TouchableOpacity>
                </View> 
                <Text style={styles.procedureListDesc}>"{procedures[key].description}"</Text>
                </View>
            
                ))}
                </>
                // </ScrollView>
                :
                // <ScrollView style={styles.procedureList}>
                    <>
            {procedureIDsAsc.map(key => ( 
        
                <View key={key} style={{marginBottom: 10}}>
                <View 
                    style={{flexDirection: 'row', paddingVertical: 5, paddingLeft: 5}}>
                    <View style={{width: '75%'}}>
                        <Text style={{fontStyle: 'italic'}}>{procedures[key].date}, {procedures[key].time}</Text>
                       
                    </View>
                    <TouchableOpacity style={styles.editProcedureText}
                        onPress={() => navigation.navigate('EditProcedure', {procedureIDs: procedureIDs,cow: route.params?.cow, cowID: index, procedureID: key})}>
                        <Text>Muokkaa</Text>
                    </TouchableOpacity>
                </View> 
                <Text style={styles.procedureListDesc}>"{procedures[key].description}"</Text>
                </View>
                ))}
                </>
                }</ScrollView></View>
            
            </>
            : // No procedures logged before
            <Text style={{fontStyle: 'italic', marginLeft: 10, marginBottom: 10}}>Ei aiempia toimenpiteitä.</Text>}

           
           
           {/* <Text>Trembling?</Text>
            <Radiobutton options={tremblingOptions} value={trembling}
                onPress={(value) => {setTrembling(value)}} /> */}
            
            
            
        <View style={{marginBottom: 30, marginRight: 10}}>
            <TouchableOpacity style={styles.customButton} onPress={() => saveChanges()}>
                <Text style={styles.buttonText}>Tallenna muutokset</Text>
            </TouchableOpacity>       
        </View>       
            
            {/* no global functionality to toggling microphone yet; useState in App.js? */}
            <MicFAB title="microphone-on" onPress={() => alert('Pressed Microphone')} />

        </View>
        
    )
}

