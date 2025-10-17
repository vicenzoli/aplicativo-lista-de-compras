import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity
} from 'react-native';

const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras/';

export default function CadastroScreen({ route, navigation }) {
  const [titulo, setTitulo] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
        title: route.params?.itemParaEditar ? 'Editar Item' : 'Novo Cadastro'
    });
    if (route.params?.itemParaEditar) {
      const { titulo, quantidade, preco } = route.params.itemParaEditar;
      setTitulo(titulo);
      setQuantidade(quantidade);
      setPreco(preco);
    } else {
        setTitulo(''); setQuantidade(''); setPreco('');
    }
  }, [route.params, navigation]);

  async function handleSubmit() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Preencha o campo Item.');
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      quantidade: quantidade.trim(),
      preco: preco.trim()
    };

    setLoading(true);

    try {
      let res;
      let url;
      let method;

      if (route.params?.itemParaEditar) {
        const id = route.params.itemParaEditar.id;
        url = `${BASE_URL}${id}`;
        method = 'PUT';
      } else {
        url = BASE_URL;
        method = 'POST';
      }

      res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert('Sucesso', route.params?.itemParaEditar ? 'Item atualizado!' : 'Item cadastrado!');
        navigation.navigate('Consulta');
      } else {
        Alert.alert('Erro', `Falha na requisição. Status: ${res.status}`);
      }
    } catch (err) {
      Alert.alert('Erro de rede', String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Item</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Maçã, Detergente" />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} placeholder="Ex: 5" keyboardType="numeric" />

      <Text style={styles.label}>Preço</Text>
      <TextInput style={styles.input} value={preco} onChangeText={setPreco} placeholder="Ex: 49.90" keyboardType="numeric" />

      {loading ? (
        <ActivityIndicator color="#1976d2" style={{ marginTop: 30 }} />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {route.params?.itemParaEditar ? 'Atualizar Item' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, width: '100%' }}>
            <Button 
              title="Voltar para a Lista" 
              color="#6c757d" 
              onPress={() => navigation.goBack()} 
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    width: '100%',
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }
});