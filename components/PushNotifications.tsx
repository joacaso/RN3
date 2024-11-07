import React, { useEffect } from 'react';
import { View, Text, Button, Platform, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configurar el handler de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface PushNotificationsProps {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
}

const PushNotifications: React.FC<PushNotificationsProps> = ({ onNotificationReceived }) => {
  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      registerForPushNotificationsAsync();
    }
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<void> => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert(
            'Error',
            'No se pudo obtener el permiso para las notificaciones push',
            [{ text: 'OK' }]
          );
          return;
        }
      } catch (error) {
        console.error('Error al registrar las notificaciones:', error);
        Alert.alert('Error', 'No se pudieron configurar las notificaciones');
      }
    }
  };

  const schedulePushNotification = async (): Promise<void> => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Notificación de prueba',
            body: '¡Esta es una notificación de prueba!',
            data: { data: 'Datos adicionales' },
          },
          trigger: { seconds: 2 },
        });
      } catch (error) {
        console.error('Error al programar la notificación:', error);
        Alert.alert(
          'Error',
          'No se pudo enviar la notificación: ' + (error as Error).message
        );
      }
    } else {
      Alert.alert(
        'No soportado',
        'Las notificaciones push no son compatibles en esta plataforma.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Notificaciones Push</Text>
      <Button 
        title="Enviar notificación"
        onPress={schedulePushNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PushNotifications;