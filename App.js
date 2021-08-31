import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import TodoList from './screens/TodoList';
import EditList from './screens/EditList';
import Colors from './constants/Colors';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Fire Todo' component={Home} />
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
    </NavigationContainer>
  );
}
