import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ProductDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product Details (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  text: { fontSize: 16, color: '#999' },
});
