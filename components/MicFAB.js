import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React from "react";
import micOn from '../icons/mic.png';
import micOff from '../icons/micOff.png';

  
const MicFAB = (props) => {
    if (props.title == 'microphone-on')  {
        return (
            <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image style={styles.FABicon} source={micOn}/>
            </TouchableOpacity>
        )
    } else if (props.title == 'microphone-off') {
        return (
            <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image style={styles.FABicon} source={micOff}/>
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
        //borderRadius: 20,
        position: "absolute",
        bottom: 15,
        right: 25,
       //left:80,
        backgroundColor: "#22bc09",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: 'black',
        elevation: 7,
        height: 67,
        width: 67,
       // width: 90,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    FABicon: {
        width: 25,
        height: 43,
        
    }
});