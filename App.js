import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Individual from './screens/Individual';
import NewCow from './screens/NewCow';
import AddButton from './components/AddButton';
import Camera from './screens/Camera';
import { LogBox } from 'react-native';
import List from './screens/List';


export default function App() {
  const Stack = createNativeStackNavigator();

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
           // headerTitle: "Vasikan neuvolakortti",
            headerTitle: "VASIKAN NEUVOLAKORTTI",
            headerRight: () => (
                <AddButton />
            ),
          }} 
          
        />

      <Stack.Screen
          name="NewCow"
          component={NewCow}
          options={{
            title: "New Cow",
            headerTitle: "Lisää uusi vasikka"
          }} 
        />  

        <Stack.Screen
          name="Individual"
          component={Individual}
          options={{
            title: "Edit cow",
            headerTitle: "Muokkaa vasikan tietoja"
          }} 
        />  

      <Stack.Screen
          name="Camera"
          component={Camera}
          options={{
            title: "Camera",
            headerTitle: "Skannaa korvanumero"
          }} 
        />

      <Stack.Screen
          name="List"
          component={List}
          options={{
            title: "List",
            headerTitle: "Vasikat",
            headerRight: () => (
              <AddButton />
          ),
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
