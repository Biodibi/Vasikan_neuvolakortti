import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React from "react";
import camera from '../icons/camera.png' ;
import cameraWhite from '../icons/camera-white.png';

const CameraFAB = (props) => {
    return (
        <TouchableOpacity style={styles.container}
            onPress={props.onPress}>
            <Image source={cameraWhite} style={styles.FABicon}/>
        </TouchableOpacity>
    );
};
  
export default CameraFAB;
  
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
       // borderRadius: 40,
        borderRadius: 20,
        position: "absolute",
        bottom: 15,
        // right: 110,
        right: 80,
        backgroundColor: "#02ab56",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: 'black',
        elevation: 7,
        height: 75,
        //width: 75,
        width: 90,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    FABicon: {
        width: 35,
        height: 30, 
    }
});