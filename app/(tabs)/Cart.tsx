// app/(tabs)/Cart.tsx
import React from 'react';
import { Image, StyleSheet, FlatList, Button, Alert, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateCartItem, clearCart } = useCart();

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

  const setQuantity = (index: number, newQuantity: number) => {
      updateCartItem(index, newQuantity);
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
        <Button title="Clear Cart" onPress={confirmClearCart} />
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
});
