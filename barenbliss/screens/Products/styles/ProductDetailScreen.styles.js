import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  productImage: {
    width: '90%',
    height: 350,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 22,
    color: '#e89dae',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stockStatusText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e89dae',
    borderRadius: 25
  },
  quantityButton: {
    padding: 5,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#e89dae',
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#e89dae',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  disabledButtonText: {
    color: '#ffffff'
  },
  quantityValue: {
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: '#e89dae',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
  },
  disabledAddToCartButton: {
    backgroundColor: '#ffffff'
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  reviewsHeader: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 15
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 999,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    flex: 1,
  },
  reviewsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#f0f0f0',
  },
  cartButton: {
    backgroundColor: '#e89dae',
  },
  continueButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    alignItems: 'center',
  },
});

export default styles;