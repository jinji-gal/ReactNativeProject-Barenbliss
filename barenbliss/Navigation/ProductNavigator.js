import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductsScreen from '../screens/Products/ProductsScreen';
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
import CartScreen from '../screens/Products/CartScreen';
import CheckoutScreen from '../screens/Products/CheckoutScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen'; 
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen';

const Stack = createStackNavigator();

const ProductNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          headerShown: false, // Hide the header completely
        }}
      />
      <Stack.Screen 
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details', // This sets the header title
          headerShown: false, // This determines if the header is shown
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Shopping Cart', headerShown: false }}
        
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ 
          title: 'Checkout',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 18,
          },
          headerTintColor: '#e89dae', // This colors the back button
        }}
      />
      <Stack.Screen
  name="Orders"
  component={OrdersScreen}
  options={{ 
    title: 'My Purchases',
    headerTitleStyle: {
      color: '#e89dae',
      fontSize: 18,
    },
    headerTintColor: '#e89dae', // This colors the back button
  }}
/>
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ 
          title: 'Order Details',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 18,
          },
          headerTintColor: '#e89dae', // This colors the back button
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 180,
    height: 35,
  }
});

export default ProductNavigator;