// app/(tabs)/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to Your Dashboard!</Text>
        <Text style={styles.description}>Here you can view important information or stats.</Text>
        {/* Add more components as needed for your dashboard */}
      </View>
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
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
  },
});

export default DashboardScreen;
