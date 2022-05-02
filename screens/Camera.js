import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, LogBox} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import scan from '../icons/scan.png';
import TextRecognition from 'react-native-text-recognition';// <- npm install react-native-text-recognition@ml 
                                                            // !!! Without @ml this doesn't work


export default function Camera({navigation, route}) {
    const [allCows, setAllCows] = useState({}); // keys


    const [imagePath,setImagePath] = useState(null);
    const [{cameraRef},{takePicture}] = useCamera(null);
    const [detectedCode, SetDetectedCode] = useState(null);
    const [scanning, setScanning] = useState(false);


    const [cowList, setCowList] = useState({});
    useEffect(() => {
        db.ref(ROOT_REF).once('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let cows = {...data};
            setCowList(cows);
            })

    },[])


// User takes a picture and the path to said image is saved
  const captureHandle = async () => {
    try {
      // if a code was detected during a previous scan, its value is nullified upon a new scan
      SetDetectedCode(null); 
      setScanning(true);
      const data = await takePicture({fixOrientation: true});
      setImagePath(data.uri)
    } catch (e) {
      alert(e);
    }
  }

  // Text recognition done after a new image has been taken
  useEffect(() => {
    (async () => {    
      if (imagePath) {
            try {

            // NO TEXT DETECTED
            const result = await TextRecognition.recognize(imagePath);
            if (result.length === 0) {
             nothingDetected(); 
             setScanning(false);
              return;
            }

            // TEXT DETECTED

            // Result quality and format from TextRecognition varies, so the result needs to be cleaned up
            const sections1 = result.toString().split(/\r?\n/); // Splitting results if there is a line break
            const sections2 = sections1.toString().split(" ");  // Splitting results if there is a space
            const sections3 = sections2.toString().split(",");  // Splitting results if there is a comma

            // Making a new array with values of appropriate lengths to avoid false readings
            const arrayOf4s = [];

            // Another new array is made to compile all suitable code options
            const arrayOfCodes = []; 
              

            // Going through the sections after cleanup; Searching for 4-character values
            for (let i = 0; i < sections3.length; i++) {

              // If a value has length of 4, it is added to another array
              if (sections3[i].toString().length === 4) { 
                arrayOf4s.push(sections3[i]);
              }
            }

            // This new array of only 4-character values is then tested to see if they contain numbers or letters
            for (let i = 0; i < arrayOf4s.length; i++) {
              if (!isNaN(Number(arrayOf4s[i]))) {
                arrayOfCodes.push(arrayOf4s[i]); // 4-character numerical values are added to new array
              }
            }
              setScanning(false);
            // Ideally this array contains only one code. But if two or more codes are scanned simultaneously, 
            // error is handled accordingly and the user is prompted to try to scan one at a time.
              if (arrayOfCodes.length > 1) {
                alert(arrayOfCodes.length + ' numerokoodia havaittu. Skannaathan yhden kerrallaan.');
              } else if (arrayOfCodes.length === 1) {
                // One code detected successfully.
                handleCodeDetected(arrayOfCodes[0]);
              } else {
                // No codes detected (text was detected but it did not contain a code)
                nothingDetected(); 
              }
          } catch (e) {
            alert(e);
          }}
    })();
  },[imagePath])


  const nothingDetected = () => Alert.alert(
    "Numerokoodia ei havaittu.", "Voit kokeilla skannata uudelleen, tai vaihtoehtoisesti kirjoittaa numerokoodin.", 
    [
      {
        text: "Kirjoita",  onPress: () => navigation.navigate('NewCow')
      },
      {
        text: "Skannaa uudestaan",
        onPress: () => console.log('pressed scan'),
      }
  ],
  {cancelable: false}
  );



  // Four-number code detected
 
  async function handleCodeDetected(code) {
    SetDetectedCode(code);
  }

// What to do when a code is detected? Following actions here ...
  useEffect(() => {
    if (detectedCode) {
        if (cowList[detectedCode]) {
            // Cow exists, moving to edit cow information
            navigation.navigate('Individual', {key: detectedCode, cow: cowList[detectedCode]});
        } else {
            // Cow doesn't exist, moving to add new cow
            navigation.navigate('NewCow', {cowNumber: detectedCode});
        }

    }
   
  }, [detectedCode])

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview} captureAudio={false}
        fixOrientation={true} >
          {scanning 
            ? <>
              <ActivityIndicator size="large" color="#fff"/>
              <Text style={styles.scanStatus}>
                Havaitaan koodia
              </Text>
              </>
            :  null
          }

        <TouchableOpacity onPress={() => captureHandle()}>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={styles.button} >
              {/* <Text style={styles.buttonText}>Havaitse</Text> */}
              <Image source={scan} style={styles.camera}/>
            </View>
          </View>
        </TouchableOpacity>

        </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  preview: {
    flex: 1,
    alignItems:'center',
    justifyContent:'flex-end',
    paddingBottom: 20,
  },
  button: {
    height: 115,
    width: 115,
    fontSize: 30,
    flex: 0,
    backgroundColor: '#22bc09',
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#55c244',
    padding: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  scanStatus: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#e8e8e8',
    margin: 20
  },
  buttonText: {
    marginVertical: 5,
    color: '#d1d1d1',
    fontWeight: 'bold'
  },
  camera: {
    width:58,
    height: 55,
    margin: 10
  }
   
})