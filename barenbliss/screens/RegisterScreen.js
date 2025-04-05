import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  Button,
  Platform,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import FormContainer from './Shared/FormContainer';
import Input from './Shared/Input';
import { registerUser } from '../Context/Actions/Auth.actions';

// Add this line to define API_URL
const API_URL = "http://192.168.100.194:3000/api";

var { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const takePhoto = async () => {
    const c = await ImagePicker.requestCameraPermissionsAsync();

    if (c.status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setMainImage(result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMainImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    // Your existing validation
    if (!email || !name || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!image) {
      setError('Please take a profile picture');
      return;
    }
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      
      // Add profile image with correct structure
      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('profileImage', {
          uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
          name: filename,
          type
        });
      }
      
      console.log("Sending registration data with image");
      
      // Make the API call
      const response = await axios.post(
        `${API_URL}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Registration response:", response.data);
      
      if (response.data) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed');
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
      contentContainerStyle={{ 
        flexGrow: 1,
        backgroundColor: '#ffe5ec',
        paddingTop: 30, // Add padding to top
      }}
    >
      <FormContainer title={"Let's Get Started!"}>
        <View style={styles.imageContainer}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#888' }}>No Image</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={takePhoto}
            style={styles.imagePicker}
          >
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Email"
          name="email"
          id="email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder="Name"
          name="name"
          id="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Phone Number"
          name="phone"
          id="phone"
          value={phone}
          keyboardType="numeric"
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder="Password"
          name="password"
          id="password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </FormContainer>
      {showSuccessModal && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="checkmark-circle" size={50} color="#e89dae" />
              <Text style={styles.modalTitle}>Registration Successful!</Text>
              <Text style={styles.modalText}>You have successfully registered!</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.modalButtonText}>Continue to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5ec',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20, // Reduced from 50
    marginBottom: 10, // Reduced from 20
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#ffe5ec",
    elevation: 10,
    marginBottom: 20,
    marginTop: 10, // Add this
    alignSelf: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#e89dae",
    padding: 8,
    borderRadius: 100,
    elevation: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e89dae',
    marginBottom: 10,
    marginTop: 50, // Increased from 10 to 50
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 16,
    color: '#e89dae',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: '#e89dae',
    width: '80%',
    padding: 10,
    borderRadius: 25,
    marginTop: -10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginButton: {
    marginTop: 10,
  },
  backToLoginText: {
    color: '#e89dae',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#e89dae',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});

export default RegisterScreen;