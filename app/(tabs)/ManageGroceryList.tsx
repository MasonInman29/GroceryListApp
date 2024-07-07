// ManageGroceryList.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { GroceryItem } from '../../components/types';
import { useGroceryList } from './context/GroceryListContext';

const ManageGroceryList: React.FC = () => {
  const { items, setItems } = useGroceryList();
  const [newItemName, setNewItemName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const addItem = () => {
    const newItem: GroceryItem = {
      id: String(items.length + 1),
      name: newItemName,
      category: 'Other', // Default category for new items
      price: 0, // Default price for new items
      count: 1, // Default count for new items
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemName('');
  };

  const handleEditItem = (item: GroceryItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      const updatedItems = items.map(item => (item.id === editingItem.id ? editingItem : item));
      setItems(updatedItems);
      setModalVisible(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.item}>
      <Text>{item.name} (x{item.count}) - ${item.price}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Grocery List</Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="Enter new item name"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {editingItem && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TextInput
                style={styles.modalInput}
                value={editingItem.name}
                onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                placeholder="Item Name"
              />
              <TextInput
                style={styles.modalInput}
                value={String(editingItem.price)}
                onChangeText={(text) => setEditingItem({ ...editingItem, price: parseFloat(text) })}
                placeholder="Item Price"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.modalInput}
                value={String(editingItem.count)}
                onChangeText={(text) => setEditingItem({ ...editingItem, count: parseInt(text, 10) })}
                placeholder="Item Count"
                keyboardType="numeric"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export default ManageGroceryList;
