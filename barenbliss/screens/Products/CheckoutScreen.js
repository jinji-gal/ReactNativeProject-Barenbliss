import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ProductContext } from '../../Context/Store/ProductGlobal';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { clearCart } from '../../redux/slices/cartSlice';
import { clearServerCart } from '../../Context/Actions/Product.actions';
import styles from './styles/CheckoutScreen.styles';

const API_URL = "http://192.168.100.170:3000/api"; // Update with your server IP

const CheckoutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { stateProducts } = useContext(ProductContext);
  const cartItems = useSelector(state => state.cart.items);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(10); // Fixed shipping cost for now
  const [total, setTotal] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Auto-apply promo code if passed from another screen
  useEffect(() => {
    if (route.params?.promoCode) {
      setPromoCode(route.params.promoCode);
      // Automatically apply the promo code
      handleApplyPromoCode(route.params.promoCode);
    }
  }, [route.params?.promoCode]);

  // Add this helper function to apply a promo code programmatically
  const handleApplyPromoCode = async (code) => {
    if (!code) return;
    
    try {
      const response = await axios.get(`${API_URL}/promotions/validate/${code.trim().toUpperCase()}`);
      
      if (response.data.valid) {
        const promoDiscount = (subTotal * response.data.promotion.discountPercent) / 100;
        setDiscount(promoDiscount);
        setAppliedPromo(response.data.promotion);
        Alert.alert('Success', `Promo code ${code} applied! You saved $${promoDiscount.toFixed(2)}`);
      } else {
        Alert.alert('Invalid Code', response.data.message || 'This promo code is invalid or expired');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'Failed to apply promo code');
    }
  };

  // Calculate totals when cart changes
  useEffect(() => {
    let sum = 0;
    if (stateProducts && stateProducts.cart) {
      stateProducts.cart.forEach(item => {
        sum += (item.product.price * item.quantity);
      });
    }
    setSubTotal(sum);
    setTotal(sum + shippingCost - discount);
  }, [stateProducts?.cart, shippingCost, discount]);

  const validateForm = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return false;
    }
    if (!zipCode.trim()) {
      Alert.alert('Error', 'Please enter your ZIP code');
      return false;
    }
    if (!country.trim()) {
      Alert.alert('Error', 'Please enter your country');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    return true;
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/promotions/validate/${promoCode.trim().toUpperCase()}`);
      
      if (response.data.valid) {
        const promoDiscount = (subTotal * response.data.promotion.discountPercent) / 100;
        setDiscount(promoDiscount);
        setAppliedPromo(response.data.promotion);
        Alert.alert('Success', `Promo code applied! You saved $${promoDiscount.toFixed(2)}`);
      } else {
        Alert.alert('Invalid Code', response.data.message || 'This promo code is invalid or expired');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'Failed to apply promo code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    if (!stateProducts || !stateProducts.cart || stateProducts.cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }
    
    try {
      setLoading(true);
      
      const orderItems = stateProducts.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const orderData = {
        orderItems,
        shippingAddress: {
          address,
          city,
          postalCode: zipCode,
          country
        },
        phoneNumber: phone,
        paymentMethod,
        itemsPrice: subTotal,
        shippingPrice: shippingCost,
        totalPrice: total
      };

      // Get the auth token
      const token = await SecureStore.getItemAsync('userToken');
      
      // Make the API call to create an order
      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Clear Redux cart
      dispatch(clearCart());
      
      // Clear Context cart if available
      if (stateProducts && typeof stateProducts.dispatch === 'function') {
        stateProducts.dispatch({ type: 'CLEAR_CART' });
      }
      
      // Also clear the server cart to ensure complete synchronization
      try {
        await clearServerCart();
      } catch (error) {
        console.error('Failed to clear server cart:', error);
      }
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Handle 404 error with mock success for development
      if (error.response && error.response.status === 404) {
        console.log("API endpoint not found, using mock success response");
        
        // Clear cart in Redux
        dispatch(clearCart());
        
        // Only clear the context cart if dispatch is available
        if (stateProducts && typeof stateProducts.dispatch === 'function') {
          stateProducts.dispatch({ type: 'CLEAR_CART' });
        }
        
        Alert.alert(
          "Order Placed (Demo)",
          "This is a demo order confirmation. In production, this would connect to your backend.",
          [
            {
              text: "Continue Shopping",
              onPress: () => navigation.navigate('Products')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'There was an error processing your order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="ZIP"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 2 }]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Country"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              paymentMethod === 'creditCard' && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod('creditCard')}
          >
            <Ionicons 
              name="card-outline" 
              size={24} 
              color={paymentMethod === 'creditCard' ? "#e89dae" : "#555"} 
            />
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'creditCard' && styles.selectedPaymentText
            ]}>
              Credit Card
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Ionicons 
              name="logo-paypal" 
              size={24} 
              color={paymentMethod === 'paypal' ? "#e89dae" : "#555"} 
            />
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'paypal' && styles.selectedPaymentText
            ]}>
              PayPal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              paymentMethod === 'cod' && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons 
              name="cash-outline" 
              size={24} 
              color={paymentMethod === 'cod' ? "#e89dae" : "#555"} 
            />
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'cod' && styles.selectedPaymentText
            ]}>
              Cash on Delivery
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.promoSection}>
            <Text style={styles.label}>Promo Code</Text>
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter promo code"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyPromoCode}
                disabled={loading}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {appliedPromo && (
              <View style={styles.appliedPromoTag}>
                <Ionicons name="pricetag" size={16} color="#4CAF50" />
                <Text style={styles.appliedPromoText}>
                  {appliedPromo.code}: {appliedPromo.discountPercent}% OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.orderSummaryItem}>
            <Text style={styles.orderSummaryLabel}>Subtotal</Text>
            <Text style={styles.orderSummaryValue}>${subTotal.toFixed(2)}</Text>
          </View>
          
          {discount > 0 && (
             <View style={styles.orderSummaryItem}>
               <Text style={[styles.orderSummaryLabel, {color: '#4CAF50'}]}>Discount</Text>
               <Text style={[styles.orderSummaryValue, {color: '#4CAF50'}]}>-${discount.toFixed(2)}</Text>
             </View>
           )}

          <View style={styles.orderSummaryItem}>
            <Text style={styles.orderSummaryLabel}>Shipping</Text>
            <Text style={styles.orderSummaryValue}>${shippingCost.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.orderSummaryItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

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
              <Text style={styles.modalTitle}>Order Placed!</Text>
              <Text style={styles.modalText}>Your order has been successfully placed!</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.viewOrdersButton]}
                  onPress={() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Orders');
                  }}
                >
                  <Text style={styles.viewOrdersButtonText}>View Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.continueButton]}
                  onPress={() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Products');
                  }}
                >
                  <Text style={styles.continueButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;