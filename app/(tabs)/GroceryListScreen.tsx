import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  count: number;
}


const initialItems: GroceryItem[] = [
  { id: '1', name: 'Milk', category: 'Fridge', price: 1.99, count: 2 },
  { id: '2', name: 'Bread', category: 'Other', price: 2.49, count: 1 },
  { id: '3', name: 'Eggs', category: 'Fridge', price: 3.29, count: 1 },
  { id: '4', name: 'Apple', category: 'Fruits', price: 0.89, count: 4 },
  { id: '5', name: 'Cheese', category: 'Fridge', price: 2.99, count: 1 },
  { id: '6', name: 'Banana', category: 'Fruit', price: 0.69, count: 1 },
  { id: '7', name: 'Frozen Brocolli', category: 'Freezer', price: 0.99, count: 9 },
  { id: '8', name: 'Chicken', category: 'Meat', price: 2.69, count: 1 },
  { id: '9', name: 'Mushrooms', category: 'Veggies', price: 2.59, count: 1 },

];

const GroceryListScreen: React.FC = () => {
  /**
   * list of all items in list regardless of categories
   */
  const [items, setItems] = useState<GroceryItem[]>(initialItems);
  
  /**
   * 3 sub list by category of item
   */
  const freezerItems = initialItems.filter(item => item.category === 'Freezer');
  const fridgeItems = initialItems.filter(item => item.category === 'Fridge' || item.category ==='Meat');
  const produceItems = initialItems.filter(item => item.category === 'Produce' || item.category ==='Fruit' || item.category ==='Veggies');
  const otherItems = initialItems.filter(item => item.category !== 'Freezer' && item.category !== 'Fridge' && item.category !== 'Meat' && item.category !== 'Produce' && item.category !== 'Fruit' && item.category !== 'Veggie');
  
  /**
   * get total cost of a GroceryItem[]
   * @param items 
   * @returns total cost of whole list
   */
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
          <Icon name="shopping-bag" size={24} color="black" /> Non-Parishable Items
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

      <Text style={styles.totalDetails}>Item total: ${getTotalItemCost(initialItems).toFixed(2)}</Text>
      <Text style={styles.totalDetails}>Tax: ${getTax(initialItems).toFixed(2)}</Text>
      <Text style={styles.total}>Total: ${(getTotalItemCost(initialItems) + getTax(initialItems)).toFixed(2)}</Text>
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