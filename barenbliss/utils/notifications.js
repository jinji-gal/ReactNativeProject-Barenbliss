import * as Notifications from 'expo-notifications';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace the import with direct definition
const API_URL = "http://192.168.100.194:3000/api"; // Update with your server IP
const BASE_URL = "http://192.168.100.194:3000"; // Base URL without /api

export const sendOrderStatusNotification = async (orderId, status, userId) => {
  try {
    // Title and body for different statuses
    const messages = {
      'pending': {
        title: 'Order Received',
        body: `Your order #${orderId.substr(-8)} has been received and is pending.`
      },
      'processing': {
        title: 'Order Processing',
        body: `Your order #${orderId.substr(-8)} is now being processed.`
      },
      'shipped': {
        title: 'Order Shipped',
        body: `Good news! Your order #${orderId.substr(-8)} has been shipped.`
      },
      'delivered': {
        title: 'Order Delivered',
        body: `Your order #${orderId.substr(-8)} has been delivered. Enjoy!`
      },
      'cancelled': {
        title: 'Order Cancelled',
        body: `Your order #${orderId.substr(-8)} has been cancelled.`
      }
    };

    const message = messages[status] || {
      title: 'Order Updated',
      body: `Your order #${orderId.substr(-8)} status has been updated to ${status}.`
    };

    // Schedule an immediate notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: { 
          orderId, 
          screen: 'OrderDetails',
          params: { orderId }, // Add params object with orderId
          status: status,
          type: 'order_status_update' 
        },
      },
      trigger: null, // Null trigger means the notification fires immediately
    });

    // Try to send to server for push notification to the user
    // Using try/catch inside to allow local notifications even if server call fails
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Fix the endpoint - most likely it should be notifications/order or users/notifications
        await axios.post(
          `${API_URL}/notifications/order`, 
          { orderId, status, userId },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }
    } catch (serverError) {
      console.log('Server notification failed, but local notification was sent:', serverError.message);
      // Don't throw error so the function completes
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Save push token to server
export const savePushTokenToServer = async (token) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken');
    
    if (!userToken) {
      console.log('User not logged in, cannot save push token');
      return;
    }
    
    await axios.post(
      `${API_URL}/users/push-token`, 
      { token },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }
    );
    
    console.log('Push token saved to server successfully');
  } catch (error) {
    console.error('Error saving push token to server:', error);
  }
};

export const handleNotificationResponse = (response, navigation) => {
  try {
    const data = response.notification.request.content.data;
    console.log('Notification data:', data);
    
    if (data?.orderId) {
      // Looking at your navigation structure, OrderDetails is inside ProductNavigator
      // Match the navigation structure in App.js
      navigation.navigate('Main', {
        screen: 'Account',
        params: {
          screen: 'Orders',
          initial: false,
          params: {
            screen: 'OrderDetails',
            params: { orderId: data.orderId }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error handling notification response:', error);
  }
};