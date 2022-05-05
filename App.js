import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Individual from './screens/Individual';
import NewCow from './screens/NewCow';
import AddButton from './components/AddButton';
import Camera from './screens/Camera';
import EditProcedure from './screens/EditProcedure';
import Settings from './screens/Settings';
import List from './screens/List';
import SplashScreen from 'react-native-splash-screen'

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
 

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' 
        screenOptions={{
            headerStyle: {
              backgroundColor: '#22bc09'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'sans-serif-light',
              fontSize: 19
            },
        }}>
      <Stack.Screen
          name="Home"
          component={Home}
          
          options={{
            title: "Home",
            headerTitle: "VASIKAN NEUVOLAKORTTI",
            headerRight: () => (
                <AddButton />
            ),
          }} 
        />

    <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Settings",
            headerTitle: "TIETOKANTA-ASETUKSET"
          }} 
        />  

      <Stack.Screen
          name="NewCow"
          component={NewCow}
          options={{
            title: "New Cow",
            headerTitle: "LISÄÄ UUSI VASIKKA"
          }} 
        />  

        <Stack.Screen
          name="Individual"
          component={Individual}
          options={{
            title: "Edit cow",
            headerTitle: "MUOKKAA VASIKAN TIETOJA"
          }} 
        />  

      <Stack.Screen
          name="Camera"
          component={Camera}
          options={{
            title: "Camera",
            headerTitle: "SKANNAA KORVANUMERO"
          }} 
        />

      <Stack.Screen
          name="List"
          component={List}
          options={{
            title: "List",
            headerTitle: "VASIKAT",
            headerRight: () => (
              <AddButton />
          ),
          }} 
        />

      <Stack.Screen
          name="EditProcedure"
          component={EditProcedure}
          options={{
            title: "EditProcedure",
            headerTitle: "MUOKKAA TOIMENPIDETTÄ"
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
