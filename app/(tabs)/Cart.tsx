import React, { useState } from 'react';
import { Image, StyleSheet, FlatList, Button, Alert, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateCartItem, clearCart, saveCart } = useCart();
  const [cartName, setCartName] = useState('');

  const confirmRemoveItem = (index: number) => {
    removeFromCart(index);
  };

  const confirmClearCart = () => {
    clearCart();
  };

  const incrementQuantity = (index: number) => {
    const newQuantity = cartItems[index].quantity + 1;
    updateCartItem(index, newQuantity);
  };

  const decrementQuantity = (index: number) => {
    const newQuantity = cartItems[index].quantity - 1;
    updateCartItem(index, newQuantity);
  };

  const handleSaveCart = () => {
    if (!cartName) {
      Alert.alert('Error', 'Please enter a name for your cart.');
      return;
    }
    saveCart(cartName);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cart</ThemedText>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imgUrl }} style={styles.cartItemImage} />
            <View style={styles.cartItemDetails}>
              <ThemedText style={styles.cartItemText}>
                {item.name} - ${item.price} x {item.quantity}
              </ThemedText>
              <View style={styles.quantityControls}>
                <Button title="-" onPress={() => decrementQuantity(index)} />
                <Button title="+" onPress={() => incrementQuantity(index)} />
              </View>
            </View>
            <Button title="Remove" onPress={() => confirmRemoveItem(index)} />
          </View>
        )}
        ListEmptyComponent={<ThemedText>Your cart is empty.</ThemedText>}
      />
      {cartItems.length > 0 && (
        <View>
          <TextInput
            style={styles.cartNameInput}
            placeholder="Enter cart name"
            value={cartName}
            onChangeText={setCartName}
          />
          <Button title="Save Cart" onPress={handleSaveCart} />
          <Button title="Clear Cart" onPress={confirmClearCart} />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemText: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 10,
    borderRadius: 4,
  },
});
