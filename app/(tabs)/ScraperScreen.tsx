import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { useCart } from '../context/CartContext';

interface Item {
  name: string;
  price: number;
  imgUrl: string;
}

const ScraperScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/scrape?query=${searchQuery}`);
      const data = await response.json();
  
      if (response.ok) {
        const parsedItems = data.search.map((item: any) => ({
          name: item.name,
          price: item.price,
          imgUrl: item.image,
        }));
        setItems(parsedItems);
      } else {
        setError(data.message || 'Failed to fetch items');
      }
    } catch (error) {
      setError('An error occurred while fetching items');
      console.error(error);
    }
    setLoading(false);
  };

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for items"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={fetchItems} disabled={loading} />
      <Button title="Go to Cart" onPress={goToCart} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Items returned: {items.length}</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <Button title="Add to cart" onPress={() => addToCart(item)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No items found.</Text>}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 8,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
  cart: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cartItemText: {
    fontSize: 16,
  },
});

export default ScraperScreen;
