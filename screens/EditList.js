import { CommonActions } from '@react-navigation/routers';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from '../configs/Colors';
import ColorSelector from '../components/ColorSelector';
import Button from '../components/Button';

const colorList = [
  'blue',
  'teal',
  'green',
  'olive',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'blueGray',
];

export default ({ navigation, route }) => {
  const [title, setTitle] = useState(route.params.title || '');
  const [color, setColor] = useState(route.params.color || Colors.blue);
  const [isValid, setIsValid] = useState(true);

  return (
    <View style={styles.container}>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>List Name</Text>
          {!isValid && (
            <Text style={{ color: Colors.red, fontSize: 12, marginLeft: 4 }}>
              * List name cannot be empty
            </Text>
          )}
        </View>
        <TextInput
          underlineColorAndroid={'transparent'}
          selectionColor={'transparent'}
          autoFocus={true}
          value={title}
          onChangeText={text => {
            setTitle(text);
            setIsValid(true);
          }}
          placeholder={'New List Name'}
          maxLength={30}
          style={[styles.input, { outline: 'none' }]}
        />
        <Text style={styles.label}>Choose Color</Text>
        <ColorSelector
          onSelect={color => {
            setColor(color);
            navigation.dispatch(CommonActions.setParams({ color }));
          }}
          selectedColor={color}
          colorOptions={colorList}
        />
      </View>
      <Button
        text='save'
        onPress={() => {
          if (title.length > 1) {
            route.params.saveChanges({ title, color });
            navigation.dispatch(CommonActions.goBack());
          } else {
            setIsValid(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    justifyContent: 'space-between',
  },
  input: {
    color: Colors.darkGray,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 0,
    height: 30,
    fontSize: 24,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: Colors.darkGray,
    height: 48,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
});
