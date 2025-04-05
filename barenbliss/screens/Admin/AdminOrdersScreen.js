import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { sendOrderStatusNotification } from '../../utils/notifications';

const API_URL = "http://192.168.100.194:3000/api"; // Update with your server IP

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      
      const response = await axios.get(
        `${API_URL}/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'processing': return '#e89dae';
      case 'shipped': return '#8bc34a';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  const handleUpdateStatus = (orderId, status) => {
    setSelectedOrderId(orderId);
    setCurrentStatus(status);
    setStatusModalVisible(true);
  };
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Send notification to the user about status update
      await sendOrderStatusNotification(orderId, newStatus, response.data.user);
      
      Alert.alert('Success', 'Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };
  
  const renderOrderItem = ({ item }) => {
    const orderDate = moment(item.created_at).format('MMM DD, YYYY');
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate('AdminOrderDetails', { orderId: item._id })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item._id.substr(-8)}</Text>
            <Text style={styles.orderDate}>{orderDate}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.userInfo}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.userName}>{item.user?.name || 'Unknown User'}</Text>
          </View>
          
          <Text style={styles.itemsCount}>
            {item.orderItems?.length || 0} {item.orderItems?.length === 1 ? 'item' : 'items'}
          </Text>
          
          <View style={styles.footer}>
            <Text style={styles.totalPrice}>₱{item.totalPrice?.toFixed(2)}</Text>
            
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={() => handleUpdateStatus(item._id, item.status)}
            >
              <Text style={styles.updateButtonText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const StatusUpdateModal = () => {
    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    return (
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            
            {statusOptions
              .filter(status => status !== currentStatus)
              .map((status, index) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    index === 0 && styles.statusOptionFirst,
                    index === statusOptions.length - 2 && styles.statusOptionLast
                  ]}
                  onPress={() => {
                    setStatusModalVisible(false);
                    updateOrderStatus(selectedOrderId, status);
                  }}
                >
                  <Text style={styles.statusOptionText}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e89dae" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}
      <StatusUpdateModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5ec',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe5ec',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(232, 157, 174, 0.2)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 157, 174, 0.2)',
    paddingTop: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(232, 157, 174, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  userName: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 157, 174, 0.1)',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e89dae',
  },
  updateButton: {
    backgroundColor: '#e89dae',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 157, 174, 0.2)',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  refreshIndicator: {
    color: '#e89dae',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusOptionFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  statusOptionLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0,
  },
  statusOptionText: {
    fontSize: 16,
    color: '#e89dae',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 12,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    fontWeight: '600',
  }
});

export default AdminOrdersScreen;