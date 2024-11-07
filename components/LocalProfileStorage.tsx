import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocalProfileStorage = () => {
  const [profile, setProfile] = useState('');
  
  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) setProfile(storedProfile);
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    await AsyncStorage.setItem('userProfile', profile);
    alert('Perfil guardado localmente');
  };

  return (
    <View>
      <TextInput
        placeholder="Escribe tu perfil"
        value={profile}
        onChangeText={setProfile}
        style={{ borderColor: 'gray', borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="Guardar Perfil" onPress={saveProfile} />
      <Text>Perfil: {profile}</Text>
    </View>
  );
};

export default LocalProfileStorage;
