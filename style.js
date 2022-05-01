import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    main: {
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flex: 1,
        
      },
      row: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center'
    },
    rowText: {
      
    },
    titleRow: {
        flexDirection: 'row'
    },
    header: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10
    },
    subHeader: {
      fontSize: 16,
      color: '#001f15'
    },
    contentContainer: {
      marginBottom: 40,
     
      backgroundColor: '#ddf1dA',
    //  borderColor: '#066127',
    // borderWidth: 2,
      borderRadius: 10,
      shadowColor: 'black',
      elevation: 10,
    },
    emptyDatabaseView: {
        marginBottom: 70,
        padding: 10,
        backgroundColor: '#e8ede9',
        borderRadius: 10,
    },
    textInputLabel: {
        color: 'black'
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 20,
        color: 'black'
    },
    customButton: {
        backgroundColor: '#22bc09',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 10,
        shadowColor: 'black',
        elevation: 6,
    },
    grayButton: {
        backgroundColor: '#d6d6d6',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 10,
        shadowColor: 'black',
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginHorizontal: 4
    },
    overviewImage: {
        width: 90,
        height: 90,
        marginRight: 10,
        marginLeft: 10,
     //   backgroundColor: '#edf2ee',
        borderRadius: 45,
        borderColor: 'white',
        borderWidth: 2.5,
        alignSelf: 'center',
    },
    overview: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#e8ede9',
      //  backgroundColor: '#e6ffd6',
      backgroundColor: '#22bc09',
        borderRadius: 20,
        shadowColor: 'black',
        elevation: 10,
        marginVertical: 10,
        
    },
    overviewText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    overviewCircle: {
        borderWidth: 1.5,
        borderRadius: 25,
        borderColor: 'white',
        alignContent: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        flex: 1,
    },
    overviewCount: {
        alignSelf: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    overviewTotal: {
        width: 70,
        height: 65,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    homeSearchBg: {
        position: 'absolute', 
        right: 15, 
        backgroundColor:'#22bc09',
        padding: 10,
        borderRadius: 25,
        flexDirection: 'row',
        shadowColor: 'black',
        elevation: 2,
    },
    FABarea: {
        flexDirection: 'row'
    },
    listBg: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 8
      //  padding: 10
    },
    settingsHeaderRow: {
        flexDirection: 'row',
      //  justifyContent: 'center',
        marginBottom: 5,
        alignItems: 'center'
    },
    lineBreak: {
        backgroundColor: 'lightgray',
        marginVertical: 25,
        width: '100%',
        height: 1,
    },
    helpText: {
        color: 'darkgrey',
        fontSize: 15,
        marginBottom: 5
    },
    procedureList: {
        backgroundColor: 'white'
    }
})

export default styles;