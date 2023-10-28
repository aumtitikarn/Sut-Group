import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firestore';
import { useNavigation } from '@react-navigation/native';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Reset Password', 'Check your email.');
    } catch (error) {
      console.error('Failed to reset password:', error);
      Alert.alert('Reset Password', 'Failed to reset password. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons style={styles.logo} name="email" size={80} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.loginButton}>
        <Button color="#8AD1DB" title="Reset password" onPress={handleResetPassword} />
      </View>
      <View style={styles.loginButton}>
        <Button color="#8AD1DB" title="Back" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FDF4E2',
  },
  logostyle: {
    marginTop: 2,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 30,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 12,
    padding: 10,
    marginRight: 30,
    marginLeft: 30,
  },
  loginButton: {
    marginTop: 12,
    marginRight: 30,
    marginLeft: 30,
  },
  register: {
    color: '#FFF',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
  logo: {
    height: 100,
    width: 320,
    marginLeft: 150,
    left: 20 
  },
});
