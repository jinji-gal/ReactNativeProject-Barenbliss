import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Image,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import API from '../../utils/api';

// Product categories
const categories = ['Face', 'Lip', 'Eye', 'Makeup Tools'];

const AdminProductEditScreen = ({ route, navigation }) => {
  const { product } = route.params || {};

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price ? product.price.toString() : '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || categories[0]);
  const [image, setImage] = useState(product?.image || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity ? product.stockQuantity.toString() : '0');
  const [loading, setLoading] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  useEffect(() => {
    // Request permissions for camera and image picker
    (async () => {
      // Request media library permissions
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to upload images.');
      }
      
      // Request camera permissions
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera permissions to take photos.');
      }
    })();
  }, []);

  const openImagePicker = () => {
    setShowImageSourceModal(true);
  };

  const takePhoto = async () => {
    setShowImageSourceModal(false);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Camera photo taken:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  const pickImage = async () => {
    setShowImageSourceModal(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Gallery image selected:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Function to create a new product
  const createProduct = async (productData) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('stockQuantity', productData.stockQuantity.toString());
      
      // Add image if it exists and it's a local file
      if (productData.image && productData.image.startsWith('file://')) {
        const filename = productData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: productData.image,
          name: filename,
          type
        });
      }
      
      const response = await API.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, message: error.message };
    }
  };

  // Function to update an existing product
  const updateProduct = async (id, productData) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('stockQuantity', productData.stockQuantity.toString());
      
      // Add image if it exists and it's a local file
      if (productData.image && productData.image.startsWith('file://')) {
        const filename = productData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: productData.image,
          name: filename,
          type
        });
      }
      
      const response = await API.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    
    try {
      setLoading(true);
      
      const productData = {
        name,
        price: parseFloat(price),
        category,
        description,
        image,
        stockQuantity: parseInt(stockQuantity) || 0
      };
      
      console.log(`Saving product: ${name}, ID: ${product?._id || 'new'}`);
      
      let result;
      if (product && product._id) {
        // Update existing product
        result = await updateProduct(product._id, productData);
      } else {
        // Create new product
        result = await createProduct(productData);
      }
      
      if (result.success) {
        Alert.alert(
          "Success", 
          product ? "Product updated" : "Product created",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Product save error:", error);
      Alert.alert("Error", "Failed to save product");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          style={styles.input}
          value={stockQuantity}
          onChangeText={setStockQuantity}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Image</Text>
        <TouchableOpacity onPress={openImagePicker} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerText}>Add Image</Text>
        </TouchableOpacity>
        
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage('')}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={60} color="#ccc" />
            <Text style={styles.noImageText}>No image selected</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>
            {product ? 'Update Product' : 'Save Product'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Image Source Selection Modal */}
      <Modal
        visible={showImageSourceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageSourceModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="#e89dae" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={pickImage}
            >
              <Ionicons name="images-outline" size={24} color="#e89dae" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, styles.cancelOption]}
              onPress={() => setShowImageSourceModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe5ec',
  },
  formGroup: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e89dae',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e89dae',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePickerButton: {
    backgroundColor: '#e89dae',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  noImageContainer: {
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e89dae',
    borderStyle: 'dashed',
  },
  noImageText: {
    color: '#999',
    marginTop: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#e89dae',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: 34,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
    letterSpacing: 0.5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
  cancelOption: {
    marginTop: 16,
    borderBottomWidth: 0,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  requiredField: {
    color: '#e89dae',
    marginLeft: 4,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockAdjustButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  }
});

export default AdminProductEditScreen;