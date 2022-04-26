import React, {useState, useEffect} from 'react';
import {Text,View,StyleSheet,Pressable,TouchableOpacity, ScrollView,TouchableWithoutFeedback,Keyboard,ActivityIndicator} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { CowRow } from '../components/CowRow';
import styles from '../style';
import MicFAB from '../components/MicFAB';
import CameraFAB from '../components/CameraFAB';

export default function List({route, navigation}) {
    const [allCows, setAllCows] = useState(route.params?.cowList);    
    const [sickCows, setSickCows] = useState(route.params?.sickCows);
    const [sickKeys, setSickKeys] = useState(route.params?.sickKeys);

    const [microphoneOn, setMicrophoneOn] = useState(route.params?.microphoneOn);

    const all = 'all';
    const sick = 'sick';

    const [currentTab, setCurrentTab] = useState(route.params?.currentTab);

    let cowKeys = Object.keys(allCows).sort();

    function toggleTab(pressed) {
        if (currentTab == pressed) { // pressing current tab does nothing
            return; 
        } else {
            if (currentTab == 'all') { 
            setCurrentTab('sick');
        } else if (currentTab == 'sick') {
            setCurrentTab('all');
        }
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={style.tabheader}>

                    <Pressable  
                      style={ currentTab=='all' ? style.activeTab : style.inactiveTab}
                      onPress={() => toggleTab(all)}
                    >
                        <Text style={style.tabText}>KAIKKI</Text>
                    </Pressable>
        
                    <Pressable
                     style={ currentTab=='all' ? style.inactiveTab : style.activeTab}
                     onPress={() => toggleTab(sick)}
                    >
                        <Text style={style.tabText}>SAIRAAT</Text>
                    </Pressable>

            </View>  
            
            <View style={style.listBg}>
            { currentTab == "all" ? 

            // All cows-list
            <ScrollView style={style.listContainer}>

            {cowKeys.length > 0 ? 
                <>
                {cowKeys.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#b8b8b8'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: allCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={allCows[key].name}
                            temperature={allCows[key].temperature}
                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))
                }
                </>
            : <Text>Tietokanta on tyhjä.</Text>
            } 
            </ScrollView>
            
            : 

            // Sick cows-list
                <ScrollView style={style.listContainer}>

                {cowKeys.length > 0 ? 
                 <>
                {sickKeys.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#b8b8b8'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: sickCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={sickCows[key].name}
                            temperature={sickCows[key].temperature}
                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))
                }
                </>
               : <Text>Tietokannassa ei ole sairaita lehmiä.</Text> }
            </ScrollView>
            }            
            </View>
<CameraFAB title="Camera" onPress={() => navigation.navigate('Camera')} />
      <MicFAB title="microphone-on"
       /*  title={microphoneOn ? "microphone-on" : "microphone-off"} 
        o nPress={() => setMicrophoneOn(!microphoneOn)} */
        />
        </View>
    )
}
const style= StyleSheet.create({
    tabheader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'stretch',
        left: 0, right: 0
    },
    tabText: {
        fontSize: 20,
        color: 'black'
    },
    tabItem: {
        marginHorizontal: 15,
        flex: 1
    },
   
    activeTab: {
     backgroundColor: '#63cf99',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5

    },
    inactiveTab: {
        backgroundColor: '#e6e6e6',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    listContainer: {
        backgroundColor: '#fff',
        padding: 3,
    }
})