import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import TodoItem from '../components/TodoItem';
import Colors from '../constants/Colors';

const renderAddListIcon = addItem => {
  return (
    <TouchableOpacity
      onPress={() => addItem({ text: '', isChecked: false, isNewItem: true })}
    >
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
};

export default ({ navigation }) => {
  const [todoItems, setTodoItems] = useState([
    { text: 'Hello', isChecked: false },
  ]);

  const addItemToLists = item => {
    todoItems.push(item);
    setTodoItems([...todoItems]);
  };

  const removeItemFromLists = index => {
    todoItems.splice(index, 1);
    setTodoItems([...todoItems]);
  };

  const updateItem = (index, item) => {
    todoItems[index] = item;
    setTodoItems([...todoItems]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(addItemToLists),
    });
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={todoItems}
        renderItem={({ item: { text, isChecked, isNewItem }, index }) => {
          return (
            <TodoItem
              text={text}
              isChecked={isChecked}
              isNewItem={isNewItem}
              onChecked={() => {
                const todoItem = todoItems[index];
                todoItem.isChecked = !isChecked;
                updateItem(index, todoItem);
              }}
              onChangeText={newText => {
                const todoItem = todoItems[index];
                todoItem.text = newText;
                updateItem(index, todoItem);
              }}
              onDelete={() => {
                removeItemFromLists(index);
              }}
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
    backgroundColor: 'white',
  },
  icon: {
    padding: 5,
    fontSize: 32,
    color: 'white',
  },
});
