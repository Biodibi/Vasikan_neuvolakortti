import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React from "react";
import scan from '../icons/scan.png';

const CameraFAB = (props) => {
    return (
        <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image source={scan} style={styles.FABicon}/>
        </TouchableOpacity>
    );
};
  
export default CameraFAB;
  
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        //borderRadius: 20,
        position: "absolute",
        bottom: 15,
        left: 25,
      //  right: 80,
        backgroundColor: "#02ab56",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: 'black',
        elevation: 7,
        height: 67,
        width: 67,
        //width: 90,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    FABicon: {
        width: 35,
        height: 35, 
    }
});