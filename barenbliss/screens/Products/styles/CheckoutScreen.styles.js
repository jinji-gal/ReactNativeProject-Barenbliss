import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5ec'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  formGroup: {
    marginBottom: 15
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555'
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10
  },
  selectedPayment: {
    borderColor: '#e89dae',
    backgroundColor: 'rgba(74, 109, 167, 0.1)'
  },
  paymentOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555'
  },
  selectedPaymentText: {
    fontWeight: 'bold',
    color: '#e89dae'
  },
  orderSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  orderSummaryLabel: {
    fontSize: 15,
    color: '#555'
  },
  orderSummaryValue: {
    fontSize: 15,
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63'
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  placeOrderButton: {
    backgroundColor: '#e89dae',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5
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
    fontSize: 24,
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
  viewOrdersButton: {
    backgroundColor: '#e89dae',
  },
  continueButton: {
    backgroundColor: '#f0f0f0',
  },
  viewOrdersButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  promoSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  promoInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    flex: 1
  },
  applyButton: {
    backgroundColor: '#e89dae',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center'
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  appliedPromoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start'
  },
  appliedPromoText: {
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14
  },
});

export default styles;