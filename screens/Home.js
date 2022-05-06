import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { db, ROOT_REF, settings } from '../firebase/Config';
import { ref } from "firebase/database";
import { CowRow } from '../components/CowRow';
import styles from '../style'
import MicFAB from '../components/MicFAB';
import CameraFAB from '../components/CameraFAB';
import cowHeadWhite from '../icons/cowHeadWhite.png';
import searchWhite from '../icons/searchWhite.png';
import gear from '../icons/gear.png';
import Voice from '@react-native-community/voice';

export default function Home({ navigation, route }) {
  const [cowList, setCowList] = useState({});
  const [sickCows, setSickCows] = useState({});

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(false);

  // by default these are the temperatures for defining when cow is sick
  const [botTemp, setBotTemp] = useState(38.4);
  const [topTemp, setTopTemp] = useState(39.6);
  const [settingsFound, setSettingsFound] = useState(false);

  // launching app calls for 'settings' and 'cows' nodes simultaneously
  // these variables make sure that everything is rendered at once when everything is ready
  const [dbReady, setDbReady] = useState(false);
  const [countReady, setCountReady] = useState(false);

  const [micActive, setMicActive] = useState(false);
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
      command: "uusi"
    },
  ];

  useEffect(() => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    Voice.start('fi-FI')

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  const onSpeechStartHandler = (e) => {
    console.log("start handler home==>>>", e)
  }

  const onSpeechEndHandler = (e) => {
    Voice.start('fi-FI')
    // Voice.destroy().then(Voice.removeAllListeners);
    console.log("stop handler", e)
  }

  const onSpeechPartialResultsHandler = (e) => {
    setVoiceText(e.value[0])
    commands.forEach((item) => {
      if ((e.value[0]).includes(item.command)) {
        if (item.command == "uusi") {
          navigation.navigate('NewCow')
        }
      }
      console.log('partial', e)
    });
  }

  const onSpeechResultsHandler = (e) => {
    console.log("speech result handler", e)
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.start('fi-FI')
  }

  const onSpeechErrorHandler = (e) => {
    console.log("speech error handler", e)
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.start('fi-FI')
  }

  async function startRecording() {
    setMicActive(true)
    try {
      await Voice.start('fi-FI'
        , {
          EXTRA_MAX_RESULTS: 100,
          EXTRA_PARTIAL_RESULTS: true,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 9900000,
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 9900000,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 9900000
        }
      )
    } catch (error) {
      console.log("error", error)
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }

  // async function stopRecording() {
  //     // setMicActive(false)

  //     try {
  //         await Voice.stop()
  //         Voice.destroy().then(Voice.removeAllListeners);
  //     } catch (error) {
  //         console.log("error", error)
  //     }
  // }


  useEffect(() => {
    if (loadingStatus) {
      db.ref(settings).on('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : null;
        if (data) {
          // if custom limits exist, default limits are overridden
          setTopTemp(data.topTemp);
          setBotTemp(data.botTemp);
          setSettingsFound(true);
        }
      });
      setCountReady(true);
      db.ref(ROOT_REF).orderByChild('number').on('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val(): {};
        for (let item in data) {
          if (item === null) {
            delete data[null]     // if there are null values in db, they arent taken into account
          }}
        let cows = {...data};
        setCowList(cows);
        setDbReady(true);
      });
      setLoadingStatus(false);
    }

  }, []);

  useEffect(() => {
    let copy = { ...cowList };
    //  alert(JSON.stringify(copy));
    for (let i = 0; i < cowKeys.length; i++) {
      // cowKeys[i] each key
      if (cowList[cowKeys[i]].temperature !== null) {
        if (cowList[cowKeys[i]].temperature !== "") {
          // ... some temperature was given...
          let current = copy[cowKeys[i]].temperature.toString().replace(/,/g, '.');
          let currentNumber = Number(current);
          if ((currentNumber >= botTemp) && (currentNumber <= topTemp)) { // is temperature healthy?
            delete copy[cowKeys[i]];
            // alert(cowKeys[i])
          }
        } else {
          // ... temperature was not given
          delete copy[cowKeys[i]];
        }
      }
    }
    setSickCows(copy);
    //setSickCows(sick);
  }, [cowList, topTemp, botTemp])

  let sickKeys = Object.keys(sickCows).sort();
  let cowKeys = Object.keys(cowList).sort();



  function getProcedureIDs(procedures) {
    let procedureIDs = Object.keys(procedures);
    return procedureIDs;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.main}>
        {!dbReady || !countReady ?
          <View style={{ flex: 1, marginTop: 25 }}>
            <Text style={{ alignSelf: 'center', fontSize: 15 }}>Ladataan tietokantaa ...
              <ActivityIndicator style={{ alignSelf: 'center' }} size="small" color="#6ad49f" /></Text>
          </View>
          :
          <>
            <View>
              {/* <Text>{botTemp}, {topTemp}</Text> */}
              <Text style={styles.subHeader}>Tilanne</Text>
              <TouchableOpacity style={{ position: 'absolute', right: 15, flexDirection: 'row' }}
                onPress={() => navigation.navigate('Settings', { botTemp: botTemp, topTemp: topTemp, settingsFound: settingsFound })}>
                <Image source={gear} style={{ height: 20, width: 20, marginRight: 5 }} />
                <Text style={{ color: '#001f15', fontSize: 15 }}>Asetukset</Text>
              </TouchableOpacity>
            </View>
            {/* CALF LIST */}
            <View style={styles.overview}>
              <Image source={cowHeadWhite} style={styles.overviewImage} />

              <View style={styles.overviewTotal}>
                <TouchableOpacity onPress={() => navigation.navigate('List', { cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'all', microphoneOn: microphoneOn })}>
                  <View style={styles.overviewCircle} >
                    <Text style={styles.overviewCount}>{cowKeys.length}</Text>
                  </View>
                  <Text style={styles.overviewText}>YHTEENSÄ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.overviewTotal}>
                <TouchableOpacity onPress={() => navigation.navigate('List', { cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'sick', microphoneOn: microphoneOn })}>
                  <View style={styles.overviewCircle} >

                    <Text style={styles.overviewCount}>{sickKeys.length}</Text>

                  </View>
                  <Text style={styles.overviewText}>SAIRAITA</Text>
                </TouchableOpacity>
              </View>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 15 }}>
              <TouchableOpacity onPress={() => navigation.navigate('List', { cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'all', microphoneOn: microphoneOn })}>
                <Text style={styles.subHeader}>Kaikki vasikat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('List', { searchActive: true, cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'all', microphoneOn: microphoneOn })}
                style={styles.homeSearchBg}>
                <Text style={{ color: 'white', fontSize: 13, marginRight: 5, marginLeft: 2 }}>Haku</Text>
                <Image source={searchWhite}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>


            <View style={styles.listBg}>
              {cowKeys.length > 0 ?
                <ScrollView style={styles.contentContainer}>

                  {
                    cowKeys.map(key => (
                      <View key={key} style={{ borderBottomWidth: 1, borderColor: '#87d477', borderBottomEndRadius: 12, borderBottomStartRadius: 12 }}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Individual', { cow: cowList[key], key: [key] })}>
                          <CowRow
                            cowNumber={key}
                            cowName={cowList[key].name}
                            temperature={cowList[key].temperature}
                            procedures={cowList[key].procedures}
                            procedureIDs={getProcedureIDs(cowList[key].procedures)}
                            sick={sickKeys.includes(key) ? true : false}
                          />

                        </TouchableOpacity>
                      </View>
                    ))}
                </ScrollView>
                : (
                  <Text style={styles.emptyDatabaseView}>Tietokanta on tyhjä.</Text>
                )}
            </View>
          </>
        }


        <CameraFAB title="Camera" onPress={() => navigation.navigate('Camera')} />
        <MicFAB status="active" title={micActive ? "microphone-on" : "microphone-off"} onPress={startRecording} />
      </View>
    </TouchableWithoutFeedback>
  )
}
