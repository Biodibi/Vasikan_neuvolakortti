import React, {useState, useEffect} from 'react';
import {Text,View,TouchableOpacity,Alert, ScrollView, Image, TouchableWithoutFeedback,Keyboard,ActivityIndicator} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { CowRow } from '../components/CowRow';
import styles from '../style'
import MicFAB from '../components/MicFAB';
import CameraFAB from '../components/CameraFAB';
import calfHead from '../icons/calfHead.png';
import cow from '../icons/cow.png';
import searchBlack from '../icons/search-black.png';

export default function Home({navigation}) {
  const [cowList, setCowList] = useState({});
  const [sickCows, setSickCows] = useState({});

  const [loadingStatus, setLoadingStatus] = useState(true); 
  const [microphoneOn, setMicrophoneOn] = useState(true);

  useEffect(() => {
    if (loadingStatus) {
      db.ref(ROOT_REF).orderByChild('number').on('value', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val(): {};
      let cows = {...data};
      setCowList(cows);
      setLoadingStatus(false);
    });
    }
  }, []);

  useEffect(() => {
    let copy = {...cowList};
    //  alert(JSON.stringify(copy));
      for (let i = 0; i < cowKeys.length; i++) {
          // cowKeys[i] each key
          if (cowList[cowKeys[i]].temperature !== null) {
              if (cowList[cowKeys[i]].temperature !== "") { 
                // ... some temperature was given...
              let current = copy[cowKeys[i]].temperature.toString().replace(/,/g, '.');
              let currentNumber = Number(current);
              if ((currentNumber >= 38.5) && (currentNumber <= 39.5)) { // is temperature healthy?
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
  }, [cowList])

  let sickKeys = Object.keys(sickCows).sort();
  let cowKeys = Object.keys(cowList).sort();

  // user clicked 'remove all'; asking for confirmation first
  const confirmDeleteAll = () => Alert.alert(
        "Varoitus: tietokannan tyhjentäminen", "Tätä ei voi perua. Oletko varma, että haluat poistaa kaikki vasikat tietokannasta?", 
        [
          {
            text: "Ei, mene takaisin.",
            onPress: () => console.log('Cancel pressed'),
          },
          {
            text: "Kyllä, poista.", onPress: () => removeConfirmed()
          }
      ],
      {cancelable: false}
      );
    
  // remove all cows
  function removeConfirmed() {
      db.ref(ROOT_REF).remove();
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.main}>
      <Text style={styles.subHeader}>Tilanne</Text>
    
    {loadingStatus ? <>
    <Text>Ladataan tietokantaa ...
    <ActivityIndicator style={{alignSelf:'center'}} size="small" color="#6ad49f" /></Text> 
    </> 
    : 
      <>
      {/* CALF LIST */}
    <View style={styles.overview}>
          <Image source={cow} style={styles.overviewImage}/>    
          
          <View style={styles.overviewTotal}>
            <TouchableOpacity onPress={() => navigation.navigate('List', {cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'all', microphoneOn: microphoneOn})}>
              <View style={styles.overviewCircle} >
                <Text style={styles.overviewCount}>{cowKeys.length}</Text>
              </View>
              <Text style={styles.overviewText}>YHTEENSÄ</Text>
            </TouchableOpacity>
            
          </View>

          <View style={styles.overviewTotal}>
          <TouchableOpacity onPress={() => navigation.navigate('List', {cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'sick', microphoneOn: microphoneOn})}>
            <View style={styles.overviewCircle} >
              <Text style={styles.overviewCount}>{sickKeys.length}</Text>
            </View>
            <Text style={styles.overviewText}>SAIRAITA</Text>
            </TouchableOpacity>
          </View>
       
    </View>
    
    {/* <TouchableOpacity style={styles.grayButton} onPress={() => confirmDeleteAll()}>
        <Text style={styles.buttonText}>Tyhjennä tietokanta</Text>
    </TouchableOpacity> */}

    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 15}}>
      <Text  style={styles.subHeader}>Kaikki vasikat</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('List',{searchActive: true, cowList: cowList, sickCows: sickCows, sickKeys: sickKeys, currentTab: 'all', microphoneOn: microphoneOn})}
        style={styles.homeSearchBg}>
        <Text style={{color: 'black', fontSize: 13, marginRight: 5, marginLeft: 2}}>Haku</Text>
        <Image source={searchBlack} 
          style={{width: 20, height: 20}}
          />
      </TouchableOpacity>
    </View>



      {cowKeys.length > 0 ? 
      <ScrollView style={styles.contentContainer}>
      {
        cowKeys.map(key => ( 
        <View key={key} style={{ borderBottomWidth: 1, borderColor: '#86a68e'}}>
          <TouchableOpacity 
          onPress={() => navigation.navigate('Individual', {cow: cowList[key], key: [key]})}>
              <CowRow 
                cowNumber={key}
                cowName={cowList[key].name}
                temperature={cowList[key].temperature}
                // trembling={cowList[key].trembling}
              />
            
          </TouchableOpacity>
        </View>
        ))
        }
        </ScrollView> : (
        <Text style={styles.emptyDatabaseView}>Tietokanta on tyhjä.</Text>
      )}
      </>
    }

    {/* <TouchableOpacity style={styles.grayButton} onPress={() => navigation.navigate('Camera', {keys: cowKeys, cowList: cowList})}>
        <Text style={styles.buttonText}>Camera</Text>
    </TouchableOpacity> */}

    
      <CameraFAB title="Camera" onPress={() => navigation.navigate('Camera')} />
      <MicFAB title={microphoneOn ? "microphone-on" : "microphone-off"} 
        onPress={() => setMicrophoneOn(!microphoneOn)} />
    </View>
    </TouchableWithoutFeedback>
  )
}
