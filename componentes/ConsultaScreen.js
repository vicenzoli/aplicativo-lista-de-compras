import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
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
    
    const deleteUrl = `${BASE_URL}${itemToDelete.id}`;

    try {
      const res = await fetch(deleteUrl, { method: 'DELETE' });

      if (res.ok) {
        setLista((prev) =>
          prev.filter((i) => String(i.id) !== String(itemToDelete.id))
        );
        Alert.alert('Sucesso', 'Item excluído.');
      } else {
        const errorText = await res.text();
        Alert.alert(
          'Erro na Exclusão',
          `Falha ao excluir. Status: ${res.status}. Detalhes: ${errorText.substring(0, 100)}`
        );
      }
    } catch (err) {
      Alert.alert('Erro de Rede', `Não foi possível conectar. ${String(err)}`);
    } finally {
      setItemToDelete(null);
      setLoading(false);
      fetchLista();
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
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonCancel]}
              onPress={() => {
                setIsModalVisible(false);
                setItemToDelete(null);
              }}
            >
              <Text style={modalStyles.textStyle}>Cancelar</Text>
            </TouchableOpacity>

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
      <DeleteConfirmationModal />

      <View style={styles.topButton}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.newButtonText}>+ Novo Item</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {lista.length === 0 ? (
            <Text style={styles.empty}>Nenhum item cadastrado ainda.</Text>
          ) : (
            lista.map((item, idx) => (
              <View key={item.id ?? idx} style={styles.card}>
                <Text style={styles.title}>{item.titulo ?? `Item ${idx + 1}`}</Text>
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Quantidade:</Text> {item.quantidade ?? '—'}
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Preço:</Text> {item.preco ?? '—'}
                </Text>
                
                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('Cadastro', { itemParaEditar: item })}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.actionButtonText}>Excluir</Text>
                  </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' },
  topButton: { width: '90%', marginVertical: 15 },
  newButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  newButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: '#333' 
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  cardButtons: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666'
  }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: '85%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#757575',
  },
  buttonDelete: {
    backgroundColor: '#d32f2f',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});