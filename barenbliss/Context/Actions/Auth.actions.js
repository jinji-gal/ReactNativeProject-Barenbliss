import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";
import axios from 'axios';

// Update this to your server's IP/domain - use your computer's IP on the same network
const API_URL = "http://192.168.100.194:3000/api";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

// New function to fetch the cart for a specific user
export const fetchUserCart = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/carts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return null;
  }
};

export const loginUser = async (user, dispatch) => {
  if (user.email && user.password) {
    try {
      // First, clear any existing cart state to prevent session bleed
      dispatch({
        type: 'CLEAR_CART'
      });
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      const { token, user: userData } = response.data;
      
      // Store token securely
      await SecureStore.setItemAsync('userToken', token);
      
      // Store user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      // Update context
      dispatch({
        type: SET_CURRENT_USER,
        payload: {
          isAuthenticated: true,
          user: userData
        }
      });
      
      // Explicitly fetch the user's cart using their token
      const userCart = await fetchUserCart(token);
      
      if (userCart && userCart.items) {
        dispatch({
          type: 'SET_CART',
          payload: userCart.items
        });
      } else {
        // Initialize with empty cart if none found
        dispatch({
          type: 'SET_CART',
          payload: []
        });
      }
      
      return true;
    } catch (error) {
      // ... error handling ...
    }
  }
};

export const registerUser = async (userData) => {
  try {
    console.log("Attempting registration with:", userData);
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log("Registration success:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
      return { success: false, message: error.response.data.message || "Registration failed" };
    } else if (error.request) {
      console.error("No response received");
      return { success: false, message: "No response from server" };
    } else {
      console.error("Error message:", error.message);
      return { success: false, message: error.message || "Registration failed" };
    }
  }
};

export const logoutUser = async (dispatch) => {
  try {
    // Get current user data before logout
    const userData = await SecureStore.getItemAsync('userData');
    const token = await SecureStore.getItemAsync('userToken');
    
    // Clear push token on server before logout
    if (token) {
      try {
        await axios.post(
          `${API_URL}/users/clear-push-token`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log("Push token cleared on server");
      } catch (err) {
        console.error("Error clearing push token:", err);
      }
    }
    
    // Clear local storage
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
    
    // Clear auth state
    dispatch({
      type: SET_CURRENT_USER,
      payload: {
        isAuthenticated: false,
        user: {}
      }
    });
    
    // Clear cart state ONLY LOCALLY (not on server)
    dispatch({
      type: 'CLEAR_CART'
    });
    
    console.log("Logged out: Cart preserved on server but cleared locally");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const updateProfile = async (userData, dispatch) => {
  try {
    const formData = new FormData();
    
    if (userData.profileImage) {
      // Handle image file
      const imageInfo = {
        uri: userData.profileImage,
        type: 'image/jpeg',
        name: 'profile-image.jpg',
      };
      formData.append('profileImage', imageInfo);
    }
    
    // Append other user data
    Object.keys(userData).forEach(key => {
      if (key !== 'profileImage') {
        formData.append(key, userData[key]);
      }
    });

    const response = await axios.put(
      `${API_URL}/users/profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`
        }
      }
    );

    if (response.data) {
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: response.data
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};