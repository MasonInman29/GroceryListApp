// app/(tabs)/HomeScreen.tsx
import React from 'react';
import { Image, StyleSheet, FlatList, Button, Alert, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '../context/CartContext';

export default function HomeScreen() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const confirmRemoveItem = (index: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromCart(index),
      },
    ]);
  };

  const confirmClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear the cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: clearCart,
      },
    ]);
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
            <ThemedText style={styles.cartItemText}>
              {item.name} - ${item.price}
            </ThemedText>
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
  cartItemText: {
    flex: 1,
    fontSize: 16,
  },
});
