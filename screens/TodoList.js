import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import TodoItem from '../components/TodoItem';
import { onSnapshot, addDoc, removeDoc } from '../services/Collections';
import { firestore, auth } from 'firebase';

const renderAddListIcon = addItem => {
  return (
    <TouchableOpacity onPress={() => addItem()}>
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
};

export default ({ navigation, route }) => {
  let [todoItems, setTodoItems] = useState([]);
  const [newItem, setNewItem] = useState();

  const todoItemsRef = firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('lists')
    .doc(route.params.listId)
    .collection('todoItems');

  useEffect(() => {
    onSnapshot(
      todoItemsRef,
      newTodoItems => {
        setTodoItems(newTodoItems);
      },
      {
        sort: (a, b) => {
          if (a.isChecked && !b.isChecked) {
            return 1;
          }
          if (b.isChecked && !a.isChecked) {
            return -1;
          }

          return 0;
        },
      }
    );
  }, []);

  const addItemToLists = () => {
    setNewItem({
      text: '',
      isChecked: false,
      new: true,
    });
  };

  const removeItemFromLists = index => {
    todoItems.splice(index, 1);
    setTodoItems([...todoItems]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(addItemToLists),
    });
  });

  if (newItem) {
    todoItems = [newItem, ...todoItems];
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={todoItems}
        renderItem={({ item: { id, text, isChecked, ...params }, index }) => {
          return (
            <TodoItem
              {...params}
              text={text}
              isChecked={isChecked}
              onChecked={() => {
                let data = { text, isChecked: !isChecked };
                if (id) {
                  data.id = id;
                }
                addDoc(todoItemsRef, data);
              }}
              onChangeText={newText => {
                if (params.new) {
                  setNewItem({
                    text: newText,
                    isChecked,
                    new: params.new,
                  });
                } else {
                  todoItems[index].text = newText;
                  setTodoItems([...todoItems]);
                }
              }}
              onDelete={() => {
                params.new ? setNewItem(null) : removeItemFromLists(index);
                id && removeDoc(todoItemsRef, id);
              }}
              onBlur={() => {
                if (text.length > 1) {
                  let data = { text, isChecked };
                  if (id) {
                    data.id = id;
                  }
                  addDoc(todoItemsRef, data);
                  params.new && setNewItem(null);
                } else {
                  params.new ? setNewItem(null) : removeItemFromLists(index);
                }
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
