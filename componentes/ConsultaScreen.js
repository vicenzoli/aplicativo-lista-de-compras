import React, { useState, useCallback, } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Button,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras';

const DeleteButton = ({ id, onDelete }) => (
  <View style={{ marginTop: 10 }}>
    <Button title="Excluir" color="#d00" onPress={() => onDelete(id)} />
  </View>
);

export default function ConsultaScreen() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchJogos() {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setJogos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const onDelete = (id) => {
    if (!id) {
      Alert.alert('Erro', 'ID do item não encontrado.');
      return;
    }

    Alert.alert('Confirmar exclusão', 'Deseja excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            const status = res.status;
            console.log('Status da exclusão:', status);

            if (status === 200 || status === 204) {

              fetchJogos();
            } else {
              Alert.alert('Erro', `Não foi possível excluir o item. Código: ${status}`);
            }
          } catch (err) {
            console.error('Erro ao excluir:', err);
            Alert.alert('Erro ao excluir', String(err));
          }
        }
      }
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchJogos();
    }, [])
  );

  function onRefresh() {
    setRefreshing(true);
    fetchJogos();
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {jogos.length === 0 ? (
            <Text style={styles.empty}>Nenhum produto cadastrado ainda.</Text>
          ) : (
            jogos.map((j, idx, item, onEdit, onDelete) => (
              <View key={j.id ?? idx} style={styles.card}>
                <Text style={styles.title}>
                  {j.titulo ?? `Produto ${idx + 1}`}
                </Text>
                <Text>Quantidade: {j.quantidade ?? '—'}</Text>
                <Text>Preço: {j.preco ?? '—'}</Text>
                <View style={styles.botoes}>
               <Button title="Editar" onPress={onEdit} color="green" />
               <Button title="Excluir" color="red" onPress={onDelete} />
              </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 8
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20
  }
});
