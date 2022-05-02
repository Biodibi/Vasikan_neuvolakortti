import React, {useState, useEffect} from 'react';
import {Text,View,TouchableOpacity, TextInput, Alert, Image, TouchableWithoutFeedback,Keyboard} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { ref, set } from "firebase/database";
import styles from '../style'
import MicFAB from '../components/MicFAB';
import cowsImage from '../icons/cowsImage.png';

export default function Home({navigation, route}) {
  const [cowNumber, setCowNumber] = useState('');
  const [cowName, setCowName] = useState('');
  const [temperature, setTemperature] = useState('');
  const [procedure, setProcedure] = useState('');

  const timestampUnix = Date.now();
  const dateObject = new Date(timestampUnix);
  const time = dateObject.toLocaleTimeString().substring(0, 5);
  const month = dateObject.getMonth()+1;
  const date = dateObject.getDate()+"."+month+"."+dateObject.getFullYear();
  const datetime = date + " " + time;
//   const [trembling, setTrembling] = useState(null);
//   const tremblingOptions = [
//     {label: 'Yes', value: true},
//     {label: 'No', value: false}
//   ];

  const [cowList, setCowList] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState(true);

  useEffect(() => { // get cowkeys from home.js instead of fetching database again here...
    if (route.params?.cowNumber) { 
      // parameter exists if user arrives from camera screen after scanning code
      // otherwise value is empty by default
      setCowNumber(route.params?.cowNumber);
    }
    db.ref(ROOT_REF).once('value', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      let cows = {...data};
      setCowList(cows);
    })
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  let cowKeys = Object.keys(cowList);

  function checkCorrectFormat(number) {
    let cowNumber = (number.trim());
    if (cowNumber.length === 4) {
     if (!isNaN(Number(cowNumber))) {
        return true; // number format is correct (four numbers)
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function checkIfExists(number) {
    for (let i = 0; i < cowKeys.length; i++) {
        if (cowKeys[i] == number) {
            return true;
        }
    }
    return false;
  }

  function addNewCow() {
    if (cowNumber.trim() !== '') {
      // then if number format is incorrect, program is halted
        if (checkCorrectFormat(cowNumber) === false) {
          Alert.alert("Tarkista korvanumero","Korvanumeron pituus on 4 ja se saa sisältää ainoastaan numeroita.",[{ text: "OK" }]);
          return;
        }
      // proceeding (cow number format is correct)
      // checking if this cow already exists (to prevent overwriting)
        if (checkIfExists(cowNumber) === true) {
            Alert.alert("Tämä vasikka on jo tietokannassa","Jos haluat muokata olemassa olevan vasikan tietoja, etsi ko. vasikka listasta, tai vaihtoehtoisesti skannaa tai sanele korvanumero.",[{ text: "OK" }]);
            return;
        } else {
          // Json parse used to prevent sending undefined values to database (undefined is not allowed)
          let saveData = {};
          let temperatureFormatted = temperature.toString().replace(/,/g, '.');
          if (procedure) {
            saveData = JSON.parse(JSON.stringify({ 
               name: cowName,
               temperature: temperatureFormatted,
               procedures: {
                 1: {
                  description: procedure,
                  date: date,
                  time: time,
                  timestampUnix: timestampUnix
                 }
               }      
             }))
           } else {
            saveData = JSON.parse(JSON.stringify({ 
             name: cowName,
             temperature: temperatureFormatted,
             procedures: "" 
           }))
           }
       set(ref(db, ROOT_REF + cowNumber), saveData)
        .then(() => {
            navigation.navigate('Home'); // Data saved successfully!
          })
          .catch((error) => {
            alert (error)   // The write failed...
          });
        }
      }  else {
        Alert.alert("Korvanumero vaaditaan","Et voi jättää tätä kenttää tyhjäksi.",[{ text: "OK" }]);
      }
        
          
    }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.main2}>
          <View style={styles.mainForm}>
            <Text style={styles.header}>Lisää uusi vasikka tietokantaan</Text>
            <View style={styles.formArea}>
            <Text style={styles.textInputLabel}>Korvanumero *</Text>
            <TextInput style={styles.textInput} maxLength={4} autoFocus={true} 
                placeholder="Nelinumeroinen korvanumero, muotoa '1234'" value={cowNumber}
                placeholderTextColor='#a3a3a3' onChangeText={setCowNumber} keyboardType='numeric' />

            <Text style={styles.textInputLabel}>Nimi</Text>
            <TextInput style={styles.textInput} placeholder='Vasikan nimi (valinnainen)' value={cowName}
               placeholderTextColor='#a3a3a3' onChangeText={setCowName}/>

            <Text style={styles.textInputLabel}>Ruumiinlämpö °C</Text>
            <TextInput style={styles.textInput} placeholder='Vasikan ruumiinlämpö (valinnainen)' 
                value={temperature} placeholderTextColor='#a3a3a3' onChangeText={setTemperature} 
                keyboardType='numeric' />

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textInputLabel}>Toimenpide   </Text>
              <Text style={styles.helpText}>{date}</Text>
            </View>
            
            <TextInput style={styles.textInput} placeholder='Vapaa kuvaus ...' multiline={true}
                value={procedure} placeholderTextColor='#a3a3a3' onChangeText={setProcedure} 
                />
           </View>  
           <View style={{marginBottom: 30, marginRight: 10}}>
            <TouchableOpacity style={styles.customButton} onPress={() => addNewCow()}>
                <Text style={styles.buttonText}>Lisää vasikka</Text>
              </TouchableOpacity>
              </View>
           </View>

           
             {keyboardStatus ? null : <Image source={cowsImage} style={styles.imageStyle}/>}
              

          
        
          <MicFAB title="microphone-on" onPress={() => alert('Pressed Microphone')} />
        </View>
    </TouchableWithoutFeedback>
   
  )
}