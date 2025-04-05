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
  FlatList // Import FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/Store/AuthGlobal';
import { logoutUser } from '../Context/Actions/Auth.actions';
import Swiper from 'react-native-swiper'; // Import Swiper
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const { dispatch } = useContext(AuthContext);
 
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
  }, []);

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

  const renderHeader = () => (
    <>
      <Swiper
        style={styles.swiper}
        showsButtons={false} // Hide navigation buttons
        autoplay={true} // Enable automatic sliding
        autoplayTimeout={3} // Set the interval to 3 seconds
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        loop={true} // Ensure the swiper loops
      >
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding1.png')} // Replace with your image path
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding2.png')} // Replace with your image path
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding3.png')} // Replace with your image path
            style={styles.slideImage}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/sliding4.png')} // Replace with your image path
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

      <Text style={styles.sectionTitle}>Featured Products</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Fixed header */}
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
      {/* Scrollable content */}
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
    zIndex: 1, // Ensure header stays on top
    position: 'relative', // Keep header in normal flow
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners
  },
  sectionTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'normal',
    marginBottom: 15,
    color: '#e89dae', // Darker color
    textAlign: 'center', // Center the text
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute items evenly
  },
  categoryItem: {
    backgroundColor: '#e89dae', // Pink background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // More rounded corners
    alignItems: 'center', // Center text horizontally
  },
  categoryText: {
    color: '#fff', // White text
    fontSize: 14,
    fontWeight: 'bold',
  },
  productContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
 
  logoImage: {
    width: 180, // Adjusted width
    height: 35, // Adjusted height
    marginRight: 100,
  },
  welcomeImage: {
    width: '100%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginTop: 10,
    resizeMode: 'cover', // Ensures the image scales properly
  },
  swiper: {
    height: '180', // Adjust the height of the swiper
    marginBottom: 10, // Add spacing below the swiper
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
    paddingBottom: 20, // Add padding to the bottom of the FlatList content
  },
  barenblissItem: {
    flex: 1, // Make each item take equal space
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
    width: '50%', // Each item takes 50% width to display 2 items per row
    padding: 5,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default HomeScreen;