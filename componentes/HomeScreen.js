import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Lista de Compras</Text>
        <Text style={styles.subtitle}>Gerencie seus itens de forma eficiente.</Text>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, styles.cadastroButton]}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.buttonText}>Cadastrar Novo Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.consultaButton]}
          onPress={() => navigation.navigate('Consulta')}
        >
          <Text style={styles.buttonText}>Consultar e Editar Lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  menuContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  menuButton: {
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cadastroButton: {
    backgroundColor: '#007bff', 
  },
  consultaButton: {
    backgroundColor: '#28a745', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});