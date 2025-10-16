import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>
      <View style={styles.btn}>
        <Button title="Listar Produto" onPress={() => navigation.navigate('Cadastro')} />
      </View>
      <View style={styles.btn}>
        <Button title="Consultar Produtos" onPress={() => navigation.navigate('Consulta')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 20,
    marginBottom: 24
  },
  btn: {
    width: '80%',
    marginVertical: 8
  }
});