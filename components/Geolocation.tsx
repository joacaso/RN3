import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

const Geolocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  return (
    <View>
      <Text>Ubicación Actual:</Text>
      {location && (
        <Text>Lat: {location.coords.latitude}, Lng: {location.coords.longitude}</Text>
      )}
    </View>
  );
};

export default Geolocation;
