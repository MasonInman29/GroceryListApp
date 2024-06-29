import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PriceFinderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Cheapest Prices</Text>
      {/* Add your price finding logic here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PriceFinderScreen;
