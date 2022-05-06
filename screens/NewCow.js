import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { db, ROOT_REF } from '../firebase/Config';
import { ref, set } from "firebase/database";
import styles from '../style'
import MicFAB from '../components/MicFAB';
import cowsImage from '../icons/cowsImage.png';
import Voice from '@react-native-community/voice'

export default function Home({ navigation, route }) {
  const [cowNumber, setCowNumber] = useState('');
  const [cowName, setCowName] = useState('');
  const [temperature, setTemperature] = useState('');
  const [procedure, setProcedure] = useState('');

  const [micActive, setMicActive] = useState(false);

  const timestampUnix = Date.now();
  const dateObject = new Date(timestampUnix);
  const time = dateObject.toLocaleTimeString().substring(0, 5);
  const month = dateObject.getMonth() + 1;
  const date = dateObject.getDate() + "." + month + "." + dateObject.getFullYear();
  const datetime = date + " " + time;
  //   const [trembling, setTrembling] = useState(null);
  //   const tremblingOptions = [
  //     {label: 'Yes', value: true},
  //     {label: 'No', value: false}
  //   ];

  const [cowList, setCowList] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState(true);

  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // Microphone toggler considerably shortens the speech input time  for some reason
  // const toggleSwitch = () => setMicActive(previousState => !previousState); {
  //     if (micActive) {
  //         startRecording()
  //     }if (!micActive) {
  //         // Voice.stop()
  //         Voice.destroy().then(Voice.removeAllListeners);
  //     }
  //   }

  const commands = [
    {
      command: "numero"
    },
    {
      command: "Numero"
    },
    {
      command: "nimi"
    },
    {
      command: "Nimi"
    },
    {
      command: "lämpö",
    },
    {
      command: "Lämpö",
    },
    {
      command: "toimenpide",
    },
    {
      command: "Toimenpide",
    },
    {
      command: "takaisin",
    },
    {
      command: "tallenna",
    },
  ];

  useEffect(() => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechRecognized = onSpeechRecognizedHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  const onSpeechStartHandler = (e) => {
    console.log("start handler new==>>>", e)
  }

  const onSpeechRecognizedHandler = (e) => {
    console.log("Recognizer new==>>>", e)
  }

  const onSpeechEndHandler = (e) => {
    console.log("stop handler", e)
    Voice.start('fi-FI')
  }

  const onSpeechPartialResultsHandler = (e) => {
    setVoiceText(e.value[0])
    commands.forEach((item) => {
      if ((e.value[0]).includes(item.command)) {
        if (item.command == "numero" || item.command == "Numero") {
          setCowNumber((e.value[0]).replace(item.command, " ").trim())
        } if (item.command == "nimi" || item.command == "Nimi") {
          setCowName((e.value[0]).replace(item.command, " ").trim())
        } if (item.command == "lämpö" || item.command == "Lämpö") {
          setTemperature((e.value[0]).replace(item.command, " ").trim())
        } if (item.command == "toimenpide" || item.command == "Toimenpide") {
          setProcedure((e.value[0]).replace(item.command, " ").trim())
        } if (item.command == "tallenna") {
          addNewCow()
        } if (item.command == "takaisin") {
          navigation.navigate('Home')
        }
      }
      console.log('partial', e)
    });
  }

  const onSpeechResultsHandler = (e) => {
    console.log("speech result handler", e)
  }

  async function startRecording() {
    setMicActive(true)
    try {
      await Voice.start('fi-FI')
    } catch (error) {
      console.log("error", error)
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }
  async function stopRecording() {
    // setMicActive(false)
    try {
      await Voice.stop()
      Voice.destroy().then(Voice.removeAllListeners);
    } catch (error) {
      console.log("error", error)
    }
  }


  useEffect(() => { // get cowkeys from home.js instead of fetching database again here...
    if (route.params?.cowNumber) {
      // parameter exists if user arrives from camera screen after scanning code
      // otherwise value is empty by default
      setCowNumber(route.params?.cowNumber);
    }
    db.ref(ROOT_REF).once('value', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      let cows = { ...data };
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
        Alert.alert("Tarkista korvanumero", "Korvanumeron pituus on 4 ja se saa sisältää ainoastaan numeroita.", [{ text: "OK" }]);
        return;
      }
      // proceeding (cow number format is correct)
      // checking if this cow already exists (to prevent overwriting)
      if (checkIfExists(cowNumber) === true) {
        Alert.alert("Tämä vasikka on jo tietokannassa", "Jos haluat muokata olemassa olevan vasikan tietoja, etsi ko. vasikka listasta, tai vaihtoehtoisesti skannaa tai sanele korvanumero.", [{ text: "OK" }]);
        return;
      } else {
        // Json parse used to prevent sending undefined values to database (undefined is not allowed)
        let saveData = {};
        let nameFormatted = cowName.charAt(0).toUpperCase() + cowName.slice(1);
        let temperatureFormatted = temperature.toString().replace(/,/g, '.');
        if (procedure) {
          let procedureFormatted = '';
          if (procedure.endsWith('.') || procedure.endsWith('!') || procedure.endsWith('?')) {
            procedureFormatted = procedure.charAt(0).toUpperCase() + procedure.slice(1);
          } else {
            procedureFormatted = procedure.charAt(0).toUpperCase() + procedure.slice(1) + '.';
          }
          saveData = JSON.parse(JSON.stringify({
            name: nameFormatted,
            temperature: temperatureFormatted,
            procedures: {
              1: {
                description: procedureFormatted,
                date: date,
                time: time,
                timestampUnix: timestampUnix
              }
            }
          }))
        } else {
          saveData = JSON.parse(JSON.stringify({
            name: nameFormatted,
            temperature: temperatureFormatted,
            procedures: ""
          }))
        }
        set(ref(db, ROOT_REF + cowNumber), saveData)
          .then(() => {
            navigation.navigate('Home'); // Data saved successfully!
          })
          .catch((error) => {
            alert(error)   // The write failed...
          });
      }
    } else {
      Alert.alert("Korvanumero vaaditaan", "Et voi jättää tätä kenttää tyhjäksi.", [{ text: "OK" }]);
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
              placeholderTextColor='#a3a3a3' onChangeText={setCowName} />

            <Text style={styles.textInputLabel}>Ruumiinlämpö °C</Text>
            <TextInput style={styles.textInput} placeholder='Vasikan ruumiinlämpö (valinnainen)'
              value={temperature} placeholderTextColor='#a3a3a3' onChangeText={setTemperature}
              keyboardType='numeric' />

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textInputLabel}>Toimenpide   </Text>
              <Text style={styles.helpText}>{date}, {time}</Text>
            </View>

            <TextInput style={styles.textInput} placeholder='Vapaa kuvaus ...' multiline={true}
              value={procedure} placeholderTextColor='#a3a3a3' onChangeText={setProcedure}
            />
          </View>
          <View style={{ marginBottom: 30, marginRight: 10 }}>
            <TouchableOpacity style={styles.customButton} onPress={() => addNewCow()}>
              <Text style={styles.buttonText}>Lisää vasikka</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity style={styles.customButton} onPress={startRecording}>
              <Text style={styles.buttonText}>alota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customButton} onPress={stopRecording}>
              <Text style={styles.buttonText}>lopeta</Text>
            </TouchableOpacity> */}


        {keyboardStatus ? null : <Image source={cowsImage} style={styles.imageStyle} />}




        <MicFAB status="active" title={micActive ? "microphone-on" : "microphone-off"} onPress={startRecording} />
      </View>
    </TouchableWithoutFeedback>

  )
}