import { View, StyleSheet, Text, Image, TouchableOpacity} from "react-native";
import React from "react";
import micOn from '../icons/mic.png';
import micOff from '../icons/micOff.png';

  
const MicFAB = (props) => {
    if (props.title == 'microphone-on' && props.status == 'active')  {
        return (
            <TouchableOpacity style={styles.active}
            onPress={props.onPress}>
            <Image style={[styles.FABicon]} source={micOn}/>
            </TouchableOpacity>
        )
    } else if (props.title == 'microphone-off' && props.status == 'active') {
        return (
            <TouchableOpacity style={styles.active}
            onPress={props.onPress}>
            <Image style={[styles.FABicon]} source={micOff}/>
            </TouchableOpacity>
        )
    } else if (props.title == 'microphone-off' && props.status == 'inactive') {
        return (
            <View style={styles.inactive}
            onPress={props.onPress}>
            <Image style={[styles.FABicon]} source={micOff}/>
            </View>
        )
    } else if (props.title == 'microphone-on' && props.status == 'inactive') {
        return (
            <View style={styles.inactive}
            onPress={props.onPress}>
            <Image style={[styles.FABicon]} source={micOff}/>
            </View>
        )
    }
 
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
        
    },
    active: {
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
    inactive: {
        justifyContent: "center",
        alignItems: "center",
         borderRadius: 40,
        //borderRadius: 20,
        position: "absolute",
        bottom: 15,
        right: 25,
       //left:80,
        backgroundColor: "#c9c9c9",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: 'black',
        elevation: 7,
        height: 67,
        width: 67,
       // width: 90,
    }
});