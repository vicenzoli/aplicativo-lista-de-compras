import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator
} from 'react-native';

const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras/';

export default function CadastroScreen({ route, navigation }) {
  const [titulo, setTitulo] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.itemParaEditar) {
      const { titulo, quantidade, preco } = route.params.itemParaEditar;
      setTitulo(titulo);
      setQuantidade(quantidade);
      setPreco(preco);
    }
  }, [route.params]);

  async function handleSubmit() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Preencha o título.');
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
      if (route.params?.itemParaEditar) {
        const id = route.params.itemParaEditar.id;
        res = await fetch(`${BASE_URL}${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Sucesso', route.params?.itemParaEditar ? 'Item atualizado.' : 'Item cadastrado.');
        setTitulo(''); setQuantidade(''); setPreco('');
        navigation.navigate('Consulta');
      } else {
        Alert.alert('Erro', JSON.stringify(data));
      }
    } catch (err) {
      Alert.alert('Erro de rede', String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Item</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Maçã, Forno..." />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} placeholder="2" keyboardType="numeric" />

      <Text style={styles.label}>Preço</Text>
      <TextInput style={styles.input} value={preco} onChangeText={setPreco} placeholder="49.90" keyboardType="numeric" />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Button title={route.params?.itemParaEditar ? 'Atualizar Item' : 'Cadastrar'} onPress={handleSubmit} />
        </View>
      )}

      <View style={{ marginTop: 12 }}>
        <Button title="Voltar" color="#888" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 }
});
