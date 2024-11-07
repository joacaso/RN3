import React, { useState, useEffect } from 'react';
import { View, Text, Platform, Alert, StyleSheet } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const GyroscopeScreen = () => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      Alert.alert(
        'No soportado',
        'El sensor de giroscopio no es compatible en esta plataforma.',
        [{ text: 'OK' }]
      );
      return;
    }

    const subscription = Gyroscope.addListener((gyroscopeData) => {
      setData(gyroscopeData);
    });

    Gyroscope.setUpdateInterval(500);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor de Giroscopio</Text>
      <Text style={styles.dataText}>Eje X: {data.x.toFixed(2)}</Text>
      <Text style={styles.dataText}>Eje Y: {data.y.toFixed(2)}</Text>
      <Text style={styles.dataText}>Eje Z: {data.z.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default GyroscopeScreen;
