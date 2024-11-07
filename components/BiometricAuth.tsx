import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricAuth = () => {
  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) Alert.alert('Autenticación exitosa');
    else Alert.alert('Autenticación fallida');
  };

  return (
    <View>
      <Text>Autenticación Biométrica</Text>
      <Button title="Autenticarse" onPress={authenticate} />
    </View>
  );
};

export default BiometricAuth;
