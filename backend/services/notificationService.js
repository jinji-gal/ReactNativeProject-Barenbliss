const axios = require('axios');
const User = require('../models/User');
const Order = require('../models/Order');

// Get message based on order status
const getNotificationMessage = (orderId, status) => {
  const orderNumber = orderId.toString().substr(-8);
  
  const templates = {
    'pending': {
      title: 'Order Received',
      body: `Your order #${orderNumber} has been received and is pending.`
    },
    'processing': {
      title: 'Order Processing',
      body: `Your order #${orderNumber} is now being processed.`
    },
    'shipped': {
      title: 'Order Shipped',
      body: `Good news! Your order #${orderNumber} has been shipped.`
    },
    'delivered': {
      title: 'Order Delivered',
      body: `Your order #${orderNumber} has been delivered. Enjoy!`
    },
    'cancelled': {
      title: 'Order Cancelled',
      body: `Your order #${orderNumber} has been cancelled.`
    }
  };
  
  return templates[status] || {
    title: 'Order Updated',
    body: `Your order #${orderNumber} status has been updated to ${status}.`
  };
};

// Send push notification using Expo's service with axios instead of fetch
const sendPushNotification = async (pushToken, message, data) => {
  try {
    const response = await axios.post('https://exp.host/--/api/v2/push/send', {
      to: pushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: data,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

// Notify user of order status change
const notifyOrderStatusChange = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    
    if (!order || !order.user) {
      console.log('Order not found or no user associated with order');
      return;
    }
    
    // Get user with push token
    const user = await User.findById(order.user);
    
    if (!user || !user.pushToken) {
      console.log('User not found or has no push token associated');
      return;
    }
    
    // Get notification message
    const message = getNotificationMessage(orderId, status);
    
    try {
      // Send push notification
      const result = await sendPushNotification(
        user.pushToken, 
        message, 
        { 
          orderId: orderId.toString(),
          screen: 'OrderDetails'
        }
      );
      
      // Check if token is invalid
      if (result.data && result.data.some(item => 
          item.status === "error" && 
          (item.message === "DeviceNotRegistered" || item.message === "InvalidCredentials")
      )) {
        console.log(`Invalid push token for user ${user._id}, clearing it`);
        user.pushToken = null;
        await user.save();
      } else {
        console.log(`Notification sent to user ${user._id} for order ${orderId}`);
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      
      // If there's an error with the token, clear it
      if (error.message && error.message.includes("DeviceNotRegistered")) {
        user.pushToken = null;
        await user.save();
        console.log(`Cleared invalid push token for user ${user._id}`);
      }
    }
  } catch (error) {
    console.error('Error in notifyOrderStatusChange:', error);
  }
};

// Notify all users about a promotion
const notifyAllUsersAboutPromotion = async (promotion) => {
  try {
    // Get all users with push tokens
    const users = await User.find({ pushToken: { $exists: true, $ne: null } });
    
    if (!users.length) {
      console.log('No users with push tokens found');
      return;
    }
    
    const message = {
      title: 'New Promotion Available!',
      body: `Use code ${promotion.code} for ${promotion.discountPercent}% off your next purchase!`
    };
    
    // Send to all users with push tokens
    let successCount = 0;
    for (const user of users) {
      try {
        await sendPushNotification(
          user.pushToken, 
          message, 
          { 
            promotionId: promotion._id.toString(),
            promoCode: promotion.code,
            discountPercent: promotion.discountPercent,
            type: 'new_promotion'
          }
        );
        successCount++;
      } catch (error) {
        console.error(`Failed to send notification to user ${user._id}:`, error);
        
        // Clear invalid tokens
        if (error.message && error.message.includes("DeviceNotRegistered")) {
          user.pushToken = null;
          await user.save();
          console.log(`Cleared invalid push token for user ${user._id}`);
        }
      }
    }
    
    console.log(`Sent promotion notification to ${successCount} users`);
  } catch (error) {
    console.error('Error notifying users about promotion:', error);
  }
};

module.exports = {
  notifyOrderStatusChange,
  notifyAllUsersAboutPromotion
};