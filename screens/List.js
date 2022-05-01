import React, {useState, useEffect} from 'react';
import {Text,TextInput,Image,View,StyleSheet,Pressable,TouchableOpacity, ScrollView,TouchableWithoutFeedback,Keyboard,ActivityIndicator} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { CowRow } from '../components/CowRow';
import styles from '../style';
import MicFAB from '../components/MicFAB';
import CameraFAB from '../components/CameraFAB';
import CircledCrossWhite from '../icons/circled-cross-white.png';
import searchGreen from '../icons/searchGreen.png';

export default function List({route, navigation}) {
    // set these inside useeffect; initially null
    // create variable for loading
    const [allCows, setAllCows] = useState(route.params?.cowList);    
    const [sickCows, setSickCows] = useState(route.params?.sickCows);
    const [sickKeys, setSickKeys] = useState(route.params?.sickKeys);
    const [searchBoxActive, setSearchBoxActive] = useState(null);
    const [microphoneOn, setMicrophoneOn] = useState(route.params?.microphoneOn);

    const [search, setSearch] = useState('');
    const [searchList, setSearchList] = useState('');

    const all = 'all';
    const sick = 'sick';

    const [currentTab, setCurrentTab] = useState(route.params?.currentTab);

    let cowKeys = Object.keys(allCows).sort();
    const textInputRef = React.useRef();

	const focusOnInput = e => {
		textInputRef.current.focus();
	};
    
    const unfocus = e => {
        textInputRef.current.clear();
        textInputRef.current.blur();
        setSearch('');
    }

    useEffect(() => {
        if (route.params?.searchActive == true) {
            navigation.addListener("focus", focusOnInput);
        }
    }, [])

    useEffect(() => {
        if (currentTab == 'all') {
            let copy = [...cowKeys];
           const searchArray = copy.filter((item) => item.startsWith(search));
           setSearchList(searchArray);
        } else if (currentTab == 'sick') {
            let copy = [...sickKeys];
            const searchArray = copy.filter((item) => item.startsWith(search));
            setSearchList(searchArray);
        }
    }, [search, currentTab])

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
    function getProcedureIDs(procedures) {   
        let procedureIDs = Object.keys(procedures);
        return procedureIDs;
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1, backgroundColor: 'white'}}> 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 5}}>
            <Image source={searchGreen}  style={{width: 40, height: 40}} /> 
                <View style={style.searchBox}>
                
                    <TextInput ref={textInputRef}
                    value={search} style={style.searchText}
                    onChangeText={text => setSearch(text)}
                    placeholder='Hae korvanumerolla...'
                    placeholderTextColor='white'
                    returnKeyType='search'
                    maxLength={4} keyboardType='numeric'
                    onFocus={() => setSearchBoxActive(true)}
                    onBlur={() => setSearchBoxActive(false)}
                    />
                    {searchBoxActive ? 
                    <>
                    {search.length > 0 ? 
                        <TouchableOpacity onPress={() => unfocus()} style={{justifyContent: 'center', right: 20, alignItems:'center', position: 'absolute'}}>
                        <Image source={CircledCrossWhite} 
                        style={{width: 18, height: 18}}
                        />
                        <Text style={{fontSize: 10, color: 'white'}}>TYHJENNÄ</Text>
                    </TouchableOpacity>
                    : null}
                    </>
                    : 
                    null
                   /*  <TouchableOpacity onPress={() => unfocus()} style={{justifyContent: 'center', right: 20, alignItems:'center', position: 'absolute'}}>
                        <Image source={searchGray} 
                        style={{width: 20, height: 20}}
                        />
                    </TouchableOpacity> */
                    }
                    
                    
                    
                </View>
            </View>
            <View style={style.tabheader}>

                    <Pressable  
                      style={ currentTab=='all' ? style.activeTab : style.inactiveTab}
                      onPress={() => toggleTab(all)}
                    >
                        <Text style={style.tabText}>KAIKKI</Text>
                    </Pressable>
                    <View style={style.space}/>
                    <Pressable
                     style={ currentTab=='all' ? style.inactiveTab : style.activeTab}
                     onPress={() => toggleTab(sick)}
                    >
                        <Text style={style.tabText}>SAIRAAT</Text>
                    </Pressable>

            </View>  
            
           
            {/* <Text>{JSON.stringify(searchList)}</Text>
            <Text>{JSON.stringify(sickKeys)}</Text> */}
            <View style={styles.listBg}>
            <View style={{padding: 10}}>
            { currentTab == "all" ? 

            // All cows-list
            <View>
            {/* <ScrollView style={styles.contentContainer}> */}
            {search != '' ? 
            <>
            {/* searching through all */}
            {searchList.length > 0 ? 
                
                <ScrollView style={styles.contentContainer}>

                {searchList.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#02ab56'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: allCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={allCows[key].name}
                            temperature={allCows[key].temperature}
                            procedures={allCows[key].procedures}
                            procedureIDs={getProcedureIDs(allCows[key].procedures)}

                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))} 
                </ScrollView>
                
            : <Text style={style.searchResultText}>Tietokannassa ei ole vastaavaa korvanumeroa.</Text>
            }
           
            </>
            : 
            
            <>
               {cowKeys.length > 0 ? 
                <ScrollView style={styles.contentContainer}>

                {cowKeys.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#02ab56'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: allCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={allCows[key].name}
                            temperature={allCows[key].temperature}
                            procedures={allCows[key].procedures}
                            procedureIDs={getProcedureIDs(allCows[key].procedures)}

                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))
                }
                </ScrollView>
            : <Text style={style.searchResultText}>Tietokanta on tyhjä.</Text>
            }
            </>
            }
          
            {/* </ScrollView> */}
            </View>
            : 

            // Sick cows-list
                <ScrollView /* style={styles.contentContainer} */ >
            {search != '' ?
            <>
            {/* searching through sick here */}
            {searchList.length > 0 ? 
                <View style={styles.contentContainer}>
                {searchList.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#02ab56'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: allCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={allCows[key].name}
                            temperature={allCows[key].temperature}
                            procedures={allCows[key].procedures}
                            procedureIDs={getProcedureIDs(allCows[key].procedures)}

                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))
                }
                </View>
            : <Text style={style.searchResultText}>Sairaiden joukossa ei ole vastaavaa korvanumeroa.</Text>
            }
            </> :<>
            {sickKeys.length > 0 ? 
                <View style={styles.contentContainer}>
                {sickKeys.map(key => ( 
                    <View key={key} style={{ borderBottomWidth: 1, borderColor: '#02ab56'}}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Individual', {cow: sickCows[key], key: [key]})}>
                        <CowRow 
                            cowNumber={key}
                            cowName={sickCows[key].name}
                            temperature={sickCows[key].temperature}
                            procedures={allCows[key].procedures}
                            procedureIDs={getProcedureIDs(allCows[key].procedures)}

                        />
                        
                    </TouchableOpacity>
                    </View>
                    ))
                }
                </View>
               : <Text style={style.searchResultText}>Tietokannassa ei ole sairaita lehmiä.</Text> }
            </>}

                
            </ScrollView>
            }            
                </View>
            </View>
<CameraFAB title="Camera" onPress={() => navigation.navigate('Camera')} />
      <MicFAB title="microphone-on"
       /*  title={microphoneOn ? "microphone-on" : "microphone-off"} 
        o nPress={() => setMicrophoneOn(!microphoneOn)} */
        />
        </View>
        </TouchableWithoutFeedback>
    )
}
const style= StyleSheet.create({
    tabheader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'stretch',
        left: 0, right: 0,
        marginBottom: 8
    },
    tabText: {
        fontSize: 20,
        color: 'white'
    },
    tabItem: {
        marginHorizontal: 15,
        flex: 1
    },
   
    activeTab: {
     backgroundColor: '#049151',
    // backgroundColor: '#15C573',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5

    },
    inactiveTab: {
        backgroundColor: '#8abd8f',
      // backgroundColor: '#bfe3ba',
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
        borderTopWidth: 1, 
        borderColor: '#b8b8b8',
        marginBottom: 20
    },
    searchBox: {
      //  backgroundColor: 'white',
        //borderColor: 'lightgray',
        //borderColor:'#5a856b',
        backgroundColor: '#15C573',
     //   borderWidth: 2,
        borderRadius: 9,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 5,
        marginHorizontal: 5,
        width: 250
    },
    searchResultText: {
        paddingLeft: 15
    },
    searchText: {
        color: 'white',
        fontSize: 17.5,
        fontStyle: 'italic'
    },
    space: {
        width: 2,
        backgroundColor: '#19592b'
    }
})