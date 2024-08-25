import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, FlatList, Button, View, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '../context/CartContext';
import * as FileSystem from 'expo-file-system';

const FILEDIRECTORY = FileSystem.documentDirectory || ''; // Use the document directory for native platforms
const FILENAME = 'savedCartsData.json';
const fileUri = FILEDIRECTORY + FILENAME;

export default function HomeScreen() {
  const [savedCarts, setSavedCarts] = useState<any[]>([]);
  const { removeFromCart, clearCart } = useCart();

  useEffect(() => {
    const loadSavedCarts = async () => {
      try {
        if (Platform.OS === 'web') {
          const existingDataStr = localStorage.getItem(FILENAME);
          const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
          setSavedCarts(existingData);
        } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (fileInfo.exists) {
            const fileContents = await FileSystem.readAsStringAsync(fileUri);
            setSavedCarts(JSON.parse(fileContents));
          } else {
            console.log("No saved carts found.");
          }
        }
      } catch (error) {
        console.error("Failed to load saved carts:", error);
      }
    };

    loadSavedCarts();
  }, []);

  const confirmRemoveCart = (index: number) => {
    const updatedCarts = [...savedCarts];
    updatedCarts.splice(index, 1);
    setSavedCarts(updatedCarts);

    const saveUpdatedCarts = async () => {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(FILENAME, JSON.stringify(updatedCarts, null, 2));
          console.log("Cart removed successfully on web.");
        } else {
          await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedCarts, null, 2));
          console.log("Cart removed successfully on native platform.");
        }
      } catch (error) {
        console.error("Failed to remove cart:", error);
      }
    };

    saveUpdatedCarts();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Saved Carts</ThemedText>
      <FlatList
        data={savedCarts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cartItem}>
            <ThemedText style={styles.cartItemText}>
              {item.name}
            </ThemedText>
            <FlatList
              data={item.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItemDetail}>
                  <Image source={{ uri: item.imgUrl }} style={styles.cartItemImage} />
                  <ThemedText style={styles.cartItemText}>
                    {item.name} - ${item.price} x {item.quantity}
                  </ThemedText>
                </View>
              )}
            />
            <Button title="Remove Cart" onPress={() => confirmRemoveCart(index)} />
          </View>
        )}
        ListEmptyComponent={<ThemedText>No saved carts available.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
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
