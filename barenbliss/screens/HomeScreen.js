// screens/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/Store/AuthGlobal';
import { logoutUser } from '../Context/Actions/Auth.actions';
import Swiper from 'react-native-swiper';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = "http://192.168.100.194:3000/api"; // Update with your server IP
const BASE_URL = "http://192.168.100.194:3000";
const categories = ['Face', 'Lip', 'Eye', 'Makeup Tools'];

const HomeScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [activePromotions, setActivePromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Check if we have a promo code passed from notifications
  useEffect(() => {
    if (route.params?.promoCode && route.params?.showPromoModal) {
      // Display the promo code notification
      Alert.alert(
        "New Promotion Available!",
        `Use code ${route.params.promoCode} for your next purchase`,
        [{ text: "OK", onPress: () => navigation.setParams({ showPromoModal: false }) }]
      );
    }
  }, [route.params?.promoCode, route.params?.showPromoModal]);
 
  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if(jsonValue != null) {
          setUserData(JSON.parse(jsonValue));
        }
      } catch(e) {
        console.log('Failed to fetch user data', e);
      }
    };
    
    getUserData();
    fetchActivePromotions();
    fetchProducts();
  }, []);
  
  const fetchActivePromotions = async () => {
    try {
      setLoadingPromotions(true);
      const response = await axios.get(`${API_URL}/promotions?active=true`);
      setActivePromotions(response.data);
      console.log('Active promotions loaded:', response.data.length);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get(`${API_URL}/products?featured=true`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => navigation.navigate('ProductNavigator', {
          screen: 'Products',
          params: { productId: item._id }
        })}
      >
        <Image
          source={{ 
            uri: item.image?.startsWith('/uploads/') 
              ? `${BASE_URL}${item.image}` 
              : item.image 
          }}
          style={styles.productImage}
        />
       
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>₱{item.price?.toFixed(2)}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        
        {/* Add the new Add to Cart button */}
        <TouchableOpacity 
          style={styles.usePromoButton}
          onPress={() => navigation.navigate('ProductNavigator', {
            screen: 'Products',
            params: { productId: item._id }
          })}
        >
          <Text style={styles.usePromoButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderPromotions = () => {
    if (activePromotions.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.promotionsContainer}>
        <Text style={styles.sectionTitle}>Active Promotions</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promotionsScroll}
        >
          {activePromotions.map(promo => (
            <View key={promo._id} style={styles.promotionCard}>
              <View style={styles.promotionHeader}>
                <Ionicons name="pricetag" size={20} color="#e89dae" />
                <Text style={styles.promoCode}>{promo.code}</Text>
              </View>
              <Text style={styles.promoDiscount}>{promo.discountPercent}% OFF</Text>
              {promo.expiryDate && (
                <Text style={styles.promoExpiry}>
                  Expires: {new Date(promo.expiryDate).toLocaleDateString()}
                </Text>
              )}
              {promo.description && (
                <Text style={styles.promoDescription} numberOfLines={2}>
                  {promo.description}
                </Text>
              )}
              <TouchableOpacity 
                style={styles.usePromoButton}
                onPress={() => navigation.navigate('ProductNavigator', {
                  screen: 'Products',
                  params: { promoCode: promo.code }
                })}
              >
                <Text style={styles.usePromoButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <Swiper
        style={styles.swiper}
        showsButtons={false}
        autoplay={true}
        autoplayTimeout={3}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        loop={true}
      >
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding1.png')}
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding2.png')}
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding3.png')}
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding4.png')}
            style={styles.slideImage}
          />
        </View>
      </Swiper>
     
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.categories}>
            <TouchableOpacity 
              key="all"
              style={[
                styles.categoryItem,
                !selectedCategory && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryText,
                !selectedCategory && styles.selectedCategoryText
              ]}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {renderPromotions()}

      <Text style={styles.sectionTitle}>Featured Products</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
          />
        </View>
        {userData?.profileImage && (
          <TouchableOpacity style={styles.profileContainer}>
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        key="flatlist-2-columns"
        ListHeaderComponent={renderHeader}
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          loadingProducts ? (
            <ActivityIndicator size="large" color="#e89dae" style={styles.loader} />
          ) : (
            <Text style={styles.noProductsText}>
              {selectedCategory ? `No products in ${selectedCategory}` : 'No products available'}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5ec',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
    position: 'relative',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    padding: 20,
    marginBottom: -10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 15,
    color: '#e89dae',
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: '#e89dae',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCategory: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e89dae',
  },
  selectedCategoryText: {
    color: '#e89dae',
  },
  productContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 180,
    height: 35,
    marginRight: 100,
  },
  welcomeImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
  },
  swiper: {
    height: '180',
    marginBottom: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dot: {
    backgroundColor: '#ffffff',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#e89dae',
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  barenblissItem: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  barenblissImage: {
    width: '100%',
    height: 100,
  },
  barenblissInfo: {
    padding: 10,
  },
  barenblissName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  barenblissPrice: {
    color: '#e89dae',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  barenblissDescription: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  productItemContainer: {
    width: '50%',
    padding: 5,
  },

  promotionsContainer: {
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  promotionsScroll: {
    paddingLeft: 10,
    paddingRight: 20,
  },
  promotionCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(232, 157, 174, 0.3)',
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  promoCode: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  promoDiscount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e89dae',
    marginVertical: 5,
  },
  promoExpiry: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  promoDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  usePromoButton: {
    backgroundColor: 'rgba(232, 157, 174, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 5,
  },
  usePromoButtonText: {
    color: '#e89dae',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
    flex: 1, // This will push the button to the bottom
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    color: '#e89dae',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  }
});

export default HomeScreen;