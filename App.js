import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import TodoList from './screens/TodoList';
import EditList from './screens/EditList';
import Login from './screens/Login';
import Settings from './screens/Settings';
import Colors from './configs/Colors';
import * as firebase from 'firebase';
import Secret from './configs/Secret';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name='Login' component={Login}></AuthStack.Screen>
    </AuthStack.Navigator>
  );
};

const Screen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Fire Todo' component={Home} />
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen
        name='TodoList'
        component={TodoList}
        options={({ route }) => {
          return {
            title: route.params.title,
            headerStyle: {
              backgroundColor: route.params.color,
            },
            headerTintColor: 'white',
          };
        }}
      />
      <Stack.Screen
        name='Edit'
        component={EditList}
        options={({ route }) => {
          return {
            title: route.params.title
              ? `${route.params.title} list`
              : 'Create new list',
            headerStyle: {
              backgroundColor: route.params.color || Colors.blue,
            },
            headerTintColor: 'white',
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (firebase.auth().currentUser) {
      setIsAuthenticated(true);
    }
    firebase.auth().onAuthStateChanged(user => {
      console.log('Checking auth state...');
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <Screen /> : <AuthScreens />}
    </NavigationContainer>
  );
}

const firebaseConfig = {
  apiKey: Secret.FIREBASE_API_KEY,
  authDomain: Secret.FIREBASE_AUTH_DOMAIN,
  projectId: Secret.FIREBASE_PROJECT_ID,
  storageBucket: Secret.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Secret.FIREBASE_MESSAGING_SENDER_ID,
  appId: Secret.FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
