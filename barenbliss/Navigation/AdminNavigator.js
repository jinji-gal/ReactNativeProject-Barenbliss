import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminProductsScreen from '../screens/Admin/AdminProductsScreen';
import AdminProductEditScreen from '../screens/Admin/AdminProductEditScreen';
import AdminOrdersScreen from '../screens/Admin/AdminOrdersScreen';
import AdminOrderDetailsScreen from '../screens/Admin/AdminOrderDetailsScreen';

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
        options={{ title: 'Product Management' }}
      />
      <Stack.Screen 
        name="AdminProductEdit" 
        component={AdminProductEditScreen}
        options={({ route }) => ({ 
          title: route.params?.product ? 'Edit Product' : 'Add Product' 
        })}
      />
      <Stack.Screen 
        name="AdminOrders" 
        component={AdminOrdersScreen}
        options={{ title: 'Order Management' }}
      />
      <Stack.Screen 
        name="AdminOrderDetails" 
        component={AdminOrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;