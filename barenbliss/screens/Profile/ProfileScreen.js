import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,  // Add this import
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../Context/Store/AuthGlobal';
import { logoutUser } from '../../Context/Actions/Auth.actions';
import Input from '../Shared/Input';
import styles from './styles/ProfileScreen.styles';

const API_URL = "http://192.168.100.194:3000/api";
const BASE_URL = "http://192.168.100.194:3000"; // Add BASE_URL for images

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { stateUser, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (stateUser.user) {
      setUser(stateUser.user);
      setName(stateUser.user.name || '');
      setEmail(stateUser.user.email || '');
      setPhone(stateUser.user.phone || '');
      setImage(stateUser.user.profileImage || null);
    }
  }, [stateUser]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
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
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => logoutUser(dispatch)
        }
      ],
      { cancelable: false }
    );
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset fields to current values if cancelling edit
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  };

  const updateProfile = async () => {
    try {
      setMessage('');
      
      // Create FormData object
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      
      // Add profile image if it's a new image (not a URL)
      if (image && (image.startsWith('file://') || image.startsWith('content://'))) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('profileImage', {
          uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
          name: filename,
          type
        });
        
        console.log("Adding image to profile update:", {
          uri: image,
          name: filename,
          type
        });
      }
      
      const token = await SecureStore.getItemAsync('userToken');
      console.log("Updating profile with token:", token ? "Token exists" : "No token");
      
      // Use the correct endpoint - try the users endpoint instead of auth
      // Make sure this endpoint matches your backend route
      const response = await axios.put(
        `${API_URL}/auth/profile`,  // Use /auth/profile instead of /users/profile
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log("Profile update response:", response.data);

      if (response.data) {
        // Update the user in state and storage
        const updatedUser = {
          ...user,
          name,
          email,
          phone,
          profileImage: response.data.user.profileImage // Make sure this matches the response structure
        };
        
        await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
        
        dispatch({
          type: 'SET_CURRENT_USER',
          payload: {
            isAuthenticated: true,
            user: updatedUser
          }
        });
        
        setMessage('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const changeProfileImage = () => {
    setShowImageModal(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {image ? (
            <Image 
              source={{ 
                uri: image.startsWith('/uploads/') 
                  ? `${BASE_URL}${image}` 
                  : image 
              }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={80} color="#999" />
            </View>
          )}
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={changeProfileImage}
          >
            <Ionicons name="camera" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Text style={styles.sectionTitle}>Account Information</Text>

        {isEditing ? (
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Name</Text>
              <Input
                placeholder="Full Name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <Input
                placeholder="Phone Number"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={toggleEdit}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={updateProfile}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoDetails}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={toggleEdit}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add My Orders Section */}
        <View style={styles.ordersSection}>
          
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('ProductNavigator', { screen: 'Orders' })}
          >
            <View style={styles.orderButtonContent}>
            <Ionicons name="bag-check-outline" size={24} color="#e89dae" />              
            <Text style={styles.orderButtonText}>View Purchased History</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <Text style={styles.orderDescription}>
            Your Digital Orders and Purchases
          </Text>
        </View>

      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={15} color="#fff" />
       
      </TouchableOpacity>

      {showImageModal && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showImageModal}
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setShowImageModal(false);
                  takePhoto();
                }}
              >
                <Ionicons name="camera-outline" size={24} color="#e89dae" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setShowImageModal(false);
                  pickImage();
                }}
              >
                <Ionicons name="images-outline" size={24} color="#e89dae" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

// Add these styles to your styles/ProfileScreen.styles.js file

// ordersSection: {
//   marginTop: 30,
//   marginBottom: 20,
// },
// orderButton: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   backgroundColor: '#f8f8f8',
//   borderRadius: 10,
//   padding: 15,
//   marginVertical: 10,
// },
// orderButtonContent: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// orderButtonText: {
//   fontSize: 16,
//   fontWeight: '500',
//   color: '#333',
//   marginLeft: 10,
// },
// orderDescription: {
//   fontSize: 14,
//   color: '#888',
//   marginTop: 5,
//   paddingLeft: 5,
// },

export default ProfileScreen;