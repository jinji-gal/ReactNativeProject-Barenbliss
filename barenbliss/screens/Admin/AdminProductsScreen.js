import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductContext } from '../../Context/Store/ProductGlobal';
import API from '../../utils/api';
import TouchableScale from '../../components/TouchableScale';

const API_URL = "http://192.168.100.194:3000/api";
const BASE_URL = "http://192.168.100.194:3000"; // Base URL without /api

const AdminProductsScreen = ({ navigation }) => {
  const { stateProducts, dispatch } = useContext(ProductContext);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("⏳ Admin: Fetching products...");
      
      const response = await API.get('/products');
      console.log("📦 Admin: Raw API response products count:", response.data?.length || 0);
      
      // Update the global state with fetched products
      dispatch({
        type: 'SET_PRODUCTS',
        payload: response.data
      });
      
      console.log('✅ Products fetched successfully for admin');
    } catch (error) {
      console.error("❌ Error fetching products for admin:", error.message);
      Alert.alert("Error", "Failed to load products: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Load products when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddProduct = () => {
    navigation.navigate('AdminProductEdit');
  };

  const handleEditProduct = (product) => {
    navigation.navigate('AdminProductEdit', { product });
  };

  const handleDeleteProduct = async (product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete ${product.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await API.delete(`/products/${product._id}`);
              
              // Update product list after deletion
              fetchProducts();
              Alert.alert("Success", "Product deleted successfully");
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  };

  const renderProductItem = ({ item }) => {
    // Debug info to help identify any issues with product IDs
    const productId = item?._id || 'missing-id';
    console.log(`Admin rendering product: ${item?.name || 'Unnamed'}, ID: ${productId}`);
    
    // Check if image URL is valid
    const hasValidImage = item?.image && (
      item.image.startsWith('http') || 
      item.image.startsWith('file:///') || 
      item.image.startsWith('data:image')
    );

    return (
      <TouchableScale 
        style={styles.productItem}
        onPress={() => handleEditProduct(item)}
      >
        <Image
          source={{ 
            uri: item.image?.startsWith('/uploads/') 
              ? `${BASE_URL}${item.image}` 
              : item.image || 'https://via.placeholder.com/100'
          }}
          style={styles.productImage}
          onError={(e) => {
            console.log('Error loading admin product image:', e.nativeEvent?.error);
          }}
        />
        
        <View style={styles.productContent}>
          <Text style={styles.productName}>{item?.name || 'Unnamed Product'}</Text>
          <Text style={styles.productPrice}>${parseFloat(item?.price || 0).toFixed(2)}</Text>
          <Text style={styles.productCategory}>{item?.category || 'Uncategorized'}</Text>
          <Text style={styles.productStock}>Stock: {item?.stockQuantity || 0}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </TouchableScale>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e89dae" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={stateProducts.products || []}
            renderItem={renderProductItem}
            keyExtractor={item => item?._id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No products found</Text>
                <Text style={styles.emptySubtext}>Add your first product</Text>
              </View>
            }
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddProduct}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    padding: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#e89dae',
    fontWeight: '600',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 13,
    color: '#555',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e89dae',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  }
});

export default AdminProductsScreen;