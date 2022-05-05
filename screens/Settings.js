import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert} from 'react-native';
import {db, ROOT_REF, settings} from '../firebase/Config';
import { ref, update } from "firebase/database";
import styles from '../style';
import MicFAB from '../components/MicFAB';
import info from '../icons/info.png';

export default function Settings({navigation, route}) {
    const [botTemp, setBotTemp] = useState(null); 
    const [topTemp, setTopTemp] = useState(null); 
    const [settingsFound, setSettingsFound] = useState(null);
    const [loading, setLoading] = useState(true);
   
    useState(() =>{
        setBotTemp(route.params?.botTemp);
        setTopTemp(route.params?.topTemp);
        setSettingsFound(route.params?.settingsFound);
        setLoading(false);
    }, [])

    function checkValues() {
        let top = Number(topTemp.toString().replace(/,/g, '.'));
        let bottom = Number(botTemp.toString().replace(/,/g, '.'));

        if (topTemp.toString().length > 0 && botTemp.toString().length > 0) { // both fields have something
            if (top >= bottom) {  
                if (!isNaN(top) && !isNaN(bottom)) {   // both are numbers
                    saveChanges(top, bottom);
                } else {
                    Alert.alert(
                        "Arvot eivät kelpaa.", "Arvot saavat sisältää ainoastaan numeroita.", 
                        [{text:"Ok"}],
                    {cancelable: false}
                    );
                }
            } else {
                Alert.alert(
                    "Arvot eivät kelpaa.", "Ylärajan arvo ei voi olla alarajaa alhaisempi.", 
                    [{text:"Ok"}],
                {cancelable: false}
                );
            }
        } else {
            Alert.alert(
                "Arvot eivät kelpaa.", "Kumpikaan kenttä ei saa olla tyhjä.", 
                [{text:"Ok"}],
            {cancelable: false}
            );
        }
    }

    function saveChanges(top, bottom) {
        

        let saveData = JSON.parse(JSON.stringify({ 
            topTemp: top,
            botTemp: bottom
        }))
        // Json parse used to prevent sending undefined values to database (undefined is not allowed)
            // if user logged new procedure while editing AND prev. procedures exist
        update(ref(db, settings), saveData)
        .then(() => {
            navigation.navigate('Home', {valuesChanged: true}); // Data saved successfully!
            //alert('save ok')
          })
          .catch((error) => {
            alert (error)   // The write failed...
          });
          
    }


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
    Alert.alert(
        "Tietokannan tyhjentäminen", "Tietojen poistaminen onnistui.",
        [
            {
                text: "Palaa kotinäytölle",
                onPress: () => navigation.navigate('Home'),
            },
    ],
    {cancelable: true}
    );
    }  

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={styles.main}>
            {loading ?
            <View style={{flex: 1, marginTop: 25}}>
                <Text style={{alignSelf:'center', fontSize: 15}}>Ladataan asetuksia ...
                <ActivityIndicator style={{alignSelf:'center'}} size="small" color="#6ad49f" /></Text> 
            </View>  :
            <>
    
            <View style={styles.settingsHeaderRow}>            
                <Text style={styles.subHeader}>Terveen vasikan ruumiinlämmön raja-arvot</Text>
            </View>                   
            <Text style={styles.helpText}>Nämä raja-arvot pätevät kaikissa samaa tietokantaa käyttävissä sovelluksissa.</Text>

            <Text style={styles.textInputLabel}>Alaraja (°C)</Text>
            <TextInput style={styles.textInput} value={botTemp.toString()} onChangeText={setBotTemp} 
                keyboardType='numeric' />
            <Text style={styles.textInputLabel}>Yläraja (°C)</Text>
            <TextInput style={styles.textInput} value={topTemp.toString()} onChangeText={setTopTemp} 
                keyboardType='numeric' />
            
                  
            <TouchableOpacity style={styles.customButton} onPress={() => checkValues()}>
                <Text style={styles.buttonText}>Tallenna ja palaa</Text>
            </TouchableOpacity>
            {/* <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Image source={info} style={{height: 17, width: 17, marginTop: 7, marginRight: 10}}/>
            <Text style={styles.helpText}>Sairaiden vasikoiden lajittelu: Uusien raja-arvojen käyttöönotto tällä laitteella vaatii sovelluksen uudelleenkäynnistyksen.</Text>
            </View> */}


                 <View style={styles.lineBreak} /> 


            <View style={styles.settingsHeaderRow}>            
                <Text style={styles.subHeader}>Tietokannan tyhjentäminen</Text>
            </View>
            <TouchableOpacity style={styles.grayButton} onPress={() => confirmDeleteAll()}>
                <Text style={styles.buttonText}>Tyhjennä tietokanta</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Image source={info} style={{height: 17, width: 17, marginTop: 7, marginRight: 10}}/>
            <Text style={styles.helpText}>Tämän valitseminen poistaa kaikki tämänhetkiset vasikat tietokannasta.</Text>
            </View>

            <MicFAB title="microphone-on" status="inactive"  />
            </>}
            

        </View>
        </TouchableWithoutFeedback>
    )
}

