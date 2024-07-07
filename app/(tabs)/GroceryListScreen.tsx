// app/(tabs)/GroceryListScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGroceryList } from './context/GroceryListContext';
import { GroceryItem } from '@/components/types';

const GroceryListScreen: React.FC = () => {
  const { items } = useGroceryList();
  
  const freezerItems = items.filter(item => item.category === 'Freezer');
  const fridgeItems = items.filter(item => item.category === 'Fridge' || item.category === 'Meat');
  const produceItems = items.filter(item => item.category === 'Produce' || item.category === 'Fruit' || item.category === 'Veggies');
  const otherItems = items.filter(item => item.category !== 'Freezer' && item.category !== 'Fridge' && item.category !== 'Meat' && item.category !== 'Produce' && item.category !== 'Fruit' && item.category !== 'Veggies');

  const getTotalItemCost = (items: GroceryItem[]) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTax = (items: GroceryItem[]) => {
    return items.reduce((total, item) => total + item.price, 0) * 0.07;
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.item}>
      <Text>{item.name} {item.count > 1 && (<Text> (x{item.count})</Text>)}</Text>
      <Text>${item.price * item.count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>

      <View style={styles.listContainer}>
        <Text style={styles.categoryTitle}>
          <Icon name="shopping-bag" size={24} color="black" /> Non-Perishable Items
        </Text>
        <FlatList
          data={otherItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.categoryTitle}>
          <Icon name="snowflake-o" size={24} color="black" /> Freezer Items
        </Text>
        <FlatList
          data={freezerItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.categoryTitle}>
          <IconCommunityIcons name="fridge" size={24} color="black" /> Fridge Items
        </Text>
        <FlatList
          data={fridgeItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.categoryTitle}>
          <Icon name="leaf" size={24} color="black" /> Produce Items
        </Text>
        <FlatList
          data={produceItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Text style={styles.totalDetails}>Item total: ${getTotalItemCost(items).toFixed(2)}</Text>
      <Text style={styles.totalDetails}>Tax: ${getTax(items).toFixed(2)}</Text>
      <Text style={styles.total}>Total: ${(getTotalItemCost(items) + getTax(items)).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  total: {
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  totalDetails: {
    textAlign: 'right',
    paddingRight: 12,
  },
});

export default GroceryListScreen;
