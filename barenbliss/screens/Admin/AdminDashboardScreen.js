import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.menuGrid}>
        <TouchableOpacity 
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AdminProducts')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e89dae' }]}>
            <Ionicons name="gift-outline" size={24} color="#fff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Products</Text>
            <Text style={styles.menuDescription}>Manage products</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AdminOrders')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e89dae' }]}>
            <Ionicons name="cart-outline" size={24} color="#fff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Orders</Text>
            <Text style={styles.menuDescription}>Track orders</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AdminPromotions')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e89dae' }]}>
            <Ionicons name="ribbon-outline" size={24} color="#fff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Promos</Text>
            <Text style={styles.menuDescription}>Manage promos</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe5ec', // Match app theme
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e89dae',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  menuItem: {
    width: '47%', // slightly less than 50% to account for spacing
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(232, 157, 174, 0.1)',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  menuContent: {
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    opacity: 0.8,
  },
  menuItemActive: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f8f8f8',
  }
});

export default AdminDashboardScreen;