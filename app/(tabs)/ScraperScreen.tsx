import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

interface Item {
  name: string;
  price: number;
}

const ScraperScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/scrape?query=${searchQuery}`);
      const data = await response.json();
      if (response.ok) {
        setItems(data);
      } else {
        setError(data.message || 'Failed to fetch items');
      }
    } catch (error) {
      setError('An error occurred while fetching items');
      console.error(error);
    }
    setLoading(false);
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
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
});

export default ScraperScreen;
