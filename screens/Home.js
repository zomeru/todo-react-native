import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../configs/Colors';

const ListButton = ({ title, color, onPress, onDelete, onOptions }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemContainer, { backgroundColor: color }]}
    >
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onOptions}>
          <Ionicons name='options-outline' size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name='trash-outline' size={24} color='white' />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const renderAddListIcon = (navigation, addItemToLists) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={{ justifyContent: 'center', marginRight: 12, marginTop: 3 }}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name='settings' size={16} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ justifyContent: 'center', marginRight: 12 }}
        onPress={() =>
          navigation.navigate('Edit', { saveChanges: addItemToLists })
        }
      >
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ({ navigation }) => {
  const [listData, setListData] = useState([
    { title: 'React Native', color: Colors.blue },
    { title: 'GraphQL', color: Colors.pink },
    { title: 'Node.js', color: Colors.green },
  ]);

  const addItemToLists = item => {
    listData.push(item);
    setListData([...listData]);
  };

  const removeItemFromLists = index => {
    listData.splice(index, 1);
    setListData([...listData]);
  };

  const updateItemFromList = (index, item) => {
    listData[index] = item;
    setListData([...listData]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(navigation, addItemToLists),
    });
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        renderItem={({ item: { title, color }, index }) => {
          return (
            <ListButton
              title={title}
              color={color}
              navigation={navigation}
              onPress={() => {
                navigation.navigate('TodoList', { title, color });
              }}
              onOptions={() => {
                navigation.navigate('Edit', {
                  title,
                  color,
                  saveChanges: item => updateItemFromList(index, item),
                });
              }}
              onDelete={() => removeItemFromLists(index)}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemTitle: { fontSize: 24, padding: 5, color: 'white' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  icon: {
    padding: 5,
    fontSize: 24,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
