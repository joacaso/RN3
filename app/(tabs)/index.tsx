import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Tab = createBottomTabNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost/backend/login.php', {
        email,
        password,
      });
      if (response.data.success) {
        alert('Login successful!');
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};


const DocumentScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedDocument, setScannedDocument] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanDocument = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setScannedDocument(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Document</Text>
      {hasPermission === null ? (
        <Text style={styles.permissionText}>Requesting for camera permission</Text>
      ) : hasPermission === false ? (
        <Text style={styles.permissionText}>No access to camera</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleScanDocument}>
          <Text style={styles.buttonText}>Scan Document</Text>
        </TouchableOpacity>
      )}
      {scannedDocument && (
        <Image source={{ uri: scannedDocument }} style={styles.image} />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);

      if (image) {
        formData.append('profile_image', {
          uri: image,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.post('http://localhost/backend/update-profile.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
const CameraProfile = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take a Profile Picture</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const GeoLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        alert('Location permission not granted');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Location</Text>
      {location ? (
        <Text>Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}</Text>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
};

const BiometricAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const authenticate = async () => {
    const hasBiometric = await LocalAuthentication.hasHardwareAsync();
    if (hasBiometric) {
      const result = await LocalAuthentication.authenticateAsync();
      setAuthenticated(result.success);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Authentication</Text>
      <TouchableOpacity style={styles.button} onPress={authenticate}>
        <Text style={styles.buttonText}>Authenticate</Text>
      </TouchableOpacity>
      {authenticated && <Text>Authenticated!</Text>}
    </View>
  );
};

const GyroscopeScreen = () => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const gyroscopeListener = Gyroscope.addListener(setData);
    Gyroscope.setUpdateInterval(1000);
    return () => gyroscopeListener.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gyroscope</Text>
      <Text>x: {data.x.toFixed(2)}, y: {data.y.toFixed(2)}, z: {data.z.toFixed(2)}</Text>
    </View>
  );
};

const PushNotifications = () => {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
    };
    registerForPushNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      <Button title="Send Test Notification" onPress={() => Notifications.scheduleNotificationAsync({
        content: { title: "Test", body: "This is a test notification" },
        trigger: { seconds: 1 }
      })} />
    </View>
  );
};

const LocalStorage = () => {
  const [name, setName] = useState('');

  const saveData = async () => {
    await AsyncStorage.setItem('name', name);
    alert('Data saved!');
  };

  const loadData = async () => {
    const savedName = await AsyncStorage.getItem('name');
    setName(savedName || '');
  };

  useEffect(() => { loadData(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Storage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={saveData}>
        <Text style={styles.buttonText}>Save Name</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
    borderColor: '#3498db',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Escáner de Documentos" component={DocumentScanner} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Camara" component={CameraProfile} />
        <Tab.Screen name="Locación" component={GeoLocation} />
        <Tab.Screen name="Biometrica" component={BiometricAuth} />
        <Tab.Screen name="Giroscopio" component={GyroscopeScreen} />
        <Tab.Screen name="Notificación" component={PushNotifications} />
        <Tab.Screen name="Storage" component={LocalStorage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App);