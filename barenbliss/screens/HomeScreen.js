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
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/Store/AuthGlobal';
import { logoutUser } from '../Context/Actions/Auth.actions';
import Swiper from 'react-native-swiper';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = "http://192.168.100.170:3000/api"; // Update with your server IP

const HomeScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [activePromotions, setActivePromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  
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

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  const barenblissData = [
    {
      id: '1',
      name: 'Modern Face Chair',
      price: 11300, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'Ergonomic design with lumbar support for all-day comfort'
    },
    {
      id: '2',
      name: 'Classic Wooden Chair',
      price: 8500, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'Timeless wooden design that fits any decor'
    },
    {
      id: '3',
      name: 'Lounge Chair',
      price: 17000, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'Perfect for relaxation with premium cushioning'
    },
    {
      id: '4',
      name: 'Eye Chair Set',
      price: 22700, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'Set of 4 elegant Eye chairs with sturdy construction'
    },
    {
      id: '5',
      name: 'Sample Chair 5',
      price: 14200, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'Another great chair for your collection'
    },
    {
      id: '6',
      name: 'Sample Chair 6',
      price: 10200, // Converted to PHP
      image: require('../assets/logo.png'), // Local asset
      description: 'A stylish chair to enhance your living space'
    },
  ];

  const renderbarenblissItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <TouchableOpacity style={styles.barenblissItem}>
        <Image
          source={item.image} // Use local asset
          style={styles.barenblissImage}
        />
        <View style={styles.heartIconContainer}>
          <FontAwesome name="heart-o" size={24} color="#e89dae" />
        </View>
        <View style={styles.barenblissInfo}>
          <Text style={styles.barenblissName}>{item.name}</Text>
          <Text style={styles.barenblissPrice}>₱{item.price}</Text>
          <Text style={styles.barenblissDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
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
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Face</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Lip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Eye</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>Makeup Tools</Text>
          </TouchableOpacity>
        </View>
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
        data={barenblissData}
        renderItem={renderbarenblissItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
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
    marginBottom: 10,
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
    justifyContent: 'space-around',
  },
  categoryItem: {
    backgroundColor: '#e89dae',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
    marginTop: 5,
  },
  usePromoButtonText: {
    color: '#e89dae',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;