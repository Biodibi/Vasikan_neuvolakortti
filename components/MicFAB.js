import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React from "react";
import microphoneOn from '../icons/microphone-on.png';
import microphoneOff from '../icons/microphone-off.png';
import microphoneOffWhite from '../icons/microphone-off-white.png';
import microphoneOffBlack from '../icons/microphone-off-black.png';
import microphoneOnWhite from '../icons/microphone-on-white.png';

  
const MicFAB = (props) => {
    if (props.title == 'microphone-on')  {
        return (
            <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image style={styles.FABicon} source={microphoneOnWhite}/>
            </TouchableOpacity>
        )
    } else if (props.title == 'microphone-off') {
        return (
            <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image style={styles.FABicon} source={microphoneOffBlack}/>
            </TouchableOpacity>
        )
    }
 /*    return (
        <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Text style={styles.title}>{props.title}</Text>
        </TouchableOpacity>
    ); */
};
  
export default MicFAB;
  
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        position: "absolute",
        bottom: 15,
        right: 20,
        backgroundColor: "#02ab56",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: 'black',
        elevation: 7,
        height: 75,
        width: 75
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    FABicon: {
        width: 20,
        height: 40,
        
    }
});