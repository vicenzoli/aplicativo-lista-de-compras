import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Button,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras/';

export default function ConsultaScreen({ navigation }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchLista = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao buscar lista.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLista();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLista();
  };

  const handleDelete = (item) => {
    if (!item || !item.id) {
      Alert.alert('Erro', 'ID do item inválido.');
      return;
    }
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsModalVisible(false);
    setLoading(true);
    
    try {
      await fetch(`${BASE_URL}${itemToDelete.id}`, { method: 'DELETE' });
      setLista((prev) =>
        prev.filter((i) => String(i.id) !== String(itemToDelete.id))
      );
      Alert.alert('Sucesso', 'Item excluído.');
    } catch (err) {
      Alert.alert('Erro de rede', `Falha ao excluir item: ${String(err)}`);
    } finally {
      setItemToDelete(null);
      setLoading(false);
    }
  };

  const DeleteConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Confirmar Exclusão</Text>
          <Text style={modalStyles.modalText}>
            Deseja realmente excluir o item 
            <Text style={{ fontWeight: 'bold' }}> "{itemToDelete?.titulo}"</Text>?
          </Text>

          <View style={modalStyles.buttonContainer}>
            {}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonCancel]}
              onPress={() => {
                setIsModalVisible(false);
                setItemToDelete(null);
              }}
            >
              <Text style={modalStyles.textStyle}>Cancelar</Text>
            </TouchableOpacity>

            {}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonDelete]}
              onPress={confirmDelete}
            >
              <Text style={modalStyles.textStyle}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {}
      <DeleteConfirmationModal />

      <View style={styles.topButton}>
        <Button
          title="+ Novo Item"
          onPress={() => navigation.navigate('Cadastro')}
          color="#1976d2"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {lista.length === 0 ? (
            <Text style={styles.empty}>Nenhum item cadastrado ainda.</Text>
          ) : (
            lista.map((item, idx) => (
              <View key={item.id ?? idx} style={styles.card}>
                <Text style={styles.title}>{item.titulo ?? `Item ${idx + 1}`}</Text>
                <Text>Quantidade: {item.quantidade ?? '—'}</Text>
                <Text>Preço: {item.Preco ?? '—'}</Text>
                <View style={styles.cardButtons}>
                  <Button
                    title="Editar"
                    color="#1976d2"
                    onPress={() => navigation.navigate('Cadastro', { itemParaEditar: item })}
                  />
                  <Button
                    title="Excluir"
                    color="#d32f2f"
                    onPress={() => handleDelete(item)}
                  />
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
  container: { flex: 1, alignItems: 'center', padding: 8 },
  topButton: { width: '90%', marginVertical: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: { fontWeight: 'bold', marginBottom: 6 },
  empty: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
  },
  buttonDelete: {
    backgroundColor: '#d32f2f',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});