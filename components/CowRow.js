import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {db, ROOT_REF} from '../firebase/Config';

// A single row for rendering cow information on the main list
export const CowRow = ({cowNumber, cowName, temperature, procedures, procedureIDs}) => {

    const onRemove = () => {
        db.ref(ROOT_REF + [cowNumber]).remove();
    }
    return (
        <View style={styles.row}>
            <View style={styles.col1}>
                <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16, marginTop: 10}}>{cowNumber}</Text>
            </View>
            <View style={styles.col2}>
                {cowName ? <Text style={{color: 'black'}}>"{cowName}"</Text> : null}
                {temperature ? <Text style={{color: '#616161'}}>Ruumiinlämpö: {temperature} °C</Text> : null} 
                {procedureIDs.length > 0 ? <Text>Toimenpiteitä kirjattu: {procedureIDs.length}</Text>:<Text>Ei toimenpiteitä.</Text>}

            </View>
            <View style={styles.col3}>
               <Text style={styles.arrow}>  ‣</Text> 
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        margin: 3,
        paddingHorizontal: 10,
        paddingBottom: 2,
        paddingTop: 2,
        // borderBottomWidth: 1,
        // borderColor: '#86a68e'
    },
    rowText: {
      color: 'black'
    },
    col1: {
        alignSelf: 'flex-start',
        marginRight: 20    
    },
    col2: {
        alignSelf: 'center',
        // alignContent: 'center',
        // flex: 1,
    },
    col3: {
        alignItems: 'flex-end',
        flex: 1
    },
    arrow: {
        fontSize: 25,
        color: '#616161'
    }
})
