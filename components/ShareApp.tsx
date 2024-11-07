import React from 'react';
import { View, Button, Share } from 'react-native';

const ShareApp = () => {
  const shareApp = async () => {
    try {
      await Share.share({ message: '¡Descarga esta aplicación increíble!' });
    } catch (error) {
      console.log('Error al compartir', error);
    }
  };

  return (
    <View>
      <Button title="Compartir App" onPress={shareApp} />
    </View>
  );
};

export default ShareApp;
