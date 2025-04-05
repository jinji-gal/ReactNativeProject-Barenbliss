import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminProductsScreen from '../screens/Admin/AdminProductsScreen';
import AdminProductEditScreen from '../screens/Admin/AdminProductEditScreen';
import AdminOrdersScreen from '../screens/Admin/AdminOrdersScreen';
import AdminOrderDetailsScreen from '../screens/Admin/AdminOrderDetailsScreen';
import AdminPromotionsScreen from '../screens/Admin/AdminPromotionsScreen';
const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AdminDashboard">
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard', headerShown: false }}
      />
      <Stack.Screen 
        name="AdminProducts" 
        component={AdminProductsScreen}
        options={{ 
          title: 'Product Management',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 22,
          },
          headerTintColor: '#e89dae', // This colors the back button
        }}
      />
      <Stack.Screen 
        name="AdminProductEdit" 
        component={AdminProductEditScreen}
        options={({ route }) => ({ 
          title: route.params?.product ? 'Edit Product' : 'Add Product',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 22,
          },
          headerTintColor: '#e89dae', // This colors the back button
        })}
      />
      <Stack.Screen 
        name="AdminOrders" 
        component={AdminOrdersScreen}
        options={{ 
          title: 'Order Management',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 22,
          },
          headerTintColor: '#e89dae', // This colors the back button
        }}
      />
      <Stack.Screen 
        name="AdminOrderDetails" 
        component={AdminOrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
       <Stack.Screen 
         name="AdminPromotions" 
         component={AdminPromotionsScreen}
         options={{ 
          title: 'Promo Management',
          headerTitleStyle: {
            color: '#e89dae',
            fontSize: 22,
          },
          headerTintColor: '#e89dae', // This colors the back button
        }}
       />
    </Stack.Navigator>
  );
};

export default AdminNavigator;