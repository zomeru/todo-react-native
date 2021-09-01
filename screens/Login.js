import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import LabeledInput from '../components/LabeledInput';
import Colors from '../configs/Colors';
import validator from 'validator';
import { auth, firestore } from 'firebase';

const validateFields = (email, password) => {
  return {
    email: validator.isEmail(email),
    password: validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  };
};

const login = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Logged in!');
    });
};

const createAccount = (email, password) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      console.log('Creating user...');
      firestore().collection('users').doc(user.uid).set({});
    });
};

export default () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [emailField, setEmailField] = useState({
    text: '',
    errorMessage: '',
  });
  const [passwordField, setPasswordField] = useState({
    text: '',
    errorMessage: '',
  });
  const [passwordConfirmField, setPasswordConfirmField] = useState({
    text: '',
    errorMessage: '',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zoms Todo</Text>
      <View style={{ flex: 1 }}>
        <LabeledInput
          label='Email'
          text={emailField.text}
          onChangeText={text => {
            setEmailField({ text });
          }}
          errorMessage={emailField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType='email'
        />
        <LabeledInput
          label='Password'
          text={passwordField.text}
          onChangeText={text => {
            setPasswordField({ text });
          }}
          secureTextEntry
          errorMessage={passwordField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType='password'
        />
        {isCreateMode && (
          <LabeledInput
            label='Confirm Password'
            text={passwordConfirmField.text}
            onChangeText={text => {
              setPasswordConfirmField({ text });
            }}
            secureTextEntry
            errorMessage={passwordConfirmField.errorMessage}
            labelStyle={styles.label}
          />
        )}
        <TouchableOpacity
          onPress={() => {
            setIsCreateMode(!isCreateMode);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: Colors.blue,
              fontSize: 16,
              margin: 4,
            }}
          >
            {isCreateMode
              ? 'Already have an account?'
              : 'Create a new account.'}
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        text={isCreateMode ? 'Create Account' : 'Login'}
        onPress={() => {
          const isValid = validateFields(emailField.text, passwordField.text);

          let isAllValid = true;

          if (!isValid.email) {
            emailField.errorMessage = 'Please enter a valid email';
            setEmailField({ ...emailField });
            isAllValid = false;
          }

          if (!isValid.password) {
            passwordField.errorMessage =
              'Password must be at least 8 characters long with at least one number, uppercase and lowercase letter, and symbol.';
            setPasswordField({ ...passwordField });
            isAllValid = false;
          }

          if (
            isCreateMode &&
            passwordConfirmField.text !== passwordField.text
          ) {
            passwordConfirmField.errorMessage = 'Passwords do not match.';
            setPasswordConfirmField({ ...passwordConfirmField });
            isAllValid = false;
          }

          if (isAllValid) {
            isCreateMode
              ? createAccount(emailField.text, passwordField.text)
              : login(emailField.text, passwordField.text);
          }
        }}
        buttonStyle={{ backgroundColor: Colors.red }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  label: { fontSize: 16, fontWeight: 'bold', color: Colors.black },
  header: {
    fontSize: 50,
    color: Colors.red,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 30,
  },
});
