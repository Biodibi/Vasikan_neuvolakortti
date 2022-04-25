import React, {useState, useEffect} from 'react';
import {Text,View,TouchableOpacity,Alert, ScrollView, Image, TouchableWithoutFeedback,Keyboard,ActivityIndicator} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { CowRow } from '../components/CowRow';
import styles from '../style'
import MicFAB from '../components/MicFAB';
import CameraFAB from '../components/CameraFAB';
import calfHead from '../icons/calfHead.png';
import cow from '../icons/cow.png';

export default function Home({navigation}) {
  const [cowList, setCowList] = useState({});
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
            <TouchableOpacity onPress={() => navigation.navigate('List')}>
              <View style={styles.overviewCircle} >
                <Text style={styles.overviewCount}>{cowKeys.length}</Text>
              </View>
              <Text style={styles.overviewText}>YHTEENSÄ</Text>
            </TouchableOpacity>
            
          </View>

        {/* Hardcoded for now, can add functionality later */}
          <View style={styles.overviewTotal}>
            <View style={styles.overviewCircle} >
              <Text style={styles.overviewCount}>0</Text>
            </View>
            <Text style={styles.overviewText}>SAIRAITA</Text>
          </View>
          <View style={styles.overviewTotal}>
            <View style={styles.overviewCircle} >
              <Text style={styles.overviewCount}>0</Text>
            </View>
            <Text style={styles.overviewText}>HOIDOSSA</Text>
          </View>
          
          {/* <Text style={styles.overviewText}>Tietokannassa on {cowKeys.length} vasikkaa.</Text> */}
    </View>
    
    {/* <TouchableOpacity style={styles.grayButton} onPress={() => confirmDeleteAll()}>
        <Text style={styles.buttonText}>Tyhjennä tietokanta</Text>
    </TouchableOpacity> */}

    <Text style={{marginTop: 10, marginBottom: 5, marginLeft: 15, fontSize: 15}}>Kaikki vasikat</Text>



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
