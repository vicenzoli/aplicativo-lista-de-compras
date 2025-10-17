import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Hook para executar ações quando a tela volta a ficar em foco

// URL base da API mock para os itens da lista de compras
const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras/';

export default function ConsultaScreen({ navigation }) {
  // Estado para armazenar a lista de itens
  const [lista, setLista] = useState([]);
  // Estado para controlar se a tela está carregando
  const [loading, setLoading] = useState(true);
  // Estado para controlar o refresh da lista via pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar a lista de itens da API
  const fetchLista = async () => {
    setLoading(true); // Ativa o loading

    try {
      const res = await fetch(BASE_URL); // Faz a requisição GET
      const data = await res.json();     // Converte a resposta para JSON
      setLista(Array.isArray(data) ? data : []); // Atualiza a lista (verificando se é um array)
    } catch (err) {
      Alert.alert('Erro', 'Falha ao buscar lista.'); // Mostra alerta se houver erro
    } finally {
      setLoading(false);     // Desativa o loading
      setRefreshing(false);  // Desativa o refreshing
    }
  };

  // useFocusEffect é executado sempre que a tela volta a estar em foco
  // Isso garante que a lista seja atualizada se o usuário voltar da tela de cadastro
  useFocusEffect(
    useCallback(() => {
      fetchLista();
    }, [])
  );

  // Função chamada ao puxar para atualizar a lista (pull-to-refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchLista();
  };

  // Função para excluir um item da lista
  const handleDelete = async (item) => {
    if (!item || !item.id) {
      Alert.alert('Erro', 'ID do item inválido.');
      return;
    }

    setLoading(true); // Ativa o loading
    const deleteUrl = `${BASE_URL}${item.id}`; // URL específica do item

    try {
      const res = await fetch(deleteUrl, { method: 'DELETE' }); // Requisição DELETE
      if (res.ok) {
        // Atualiza a lista local removendo o item excluído
        setLista((prev) => prev.filter((i) => String(i.id) !== String(item.id)));
        Alert.alert('Sucesso', 'Item excluído.');
      } else {
        // Se a exclusão falhar, mostra o status e detalhes do erro (limitado a 100 caracteres)
        const errorText = await res.text();
        Alert.alert(
          'Erro na Exclusão',
          `Falha ao excluir. Status: ${res.status}. Detalhes: ${errorText.substring(0, 100)}`
        );
      }
    } catch (err) {
      Alert.alert('Erro de Rede', `Não foi possível conectar. ${String(err)}`);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão no topo para criar novo item */}
      <View style={styles.topButton}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Cadastro')} // Navega para tela de cadastro
        >
          <Text style={styles.newButtonText}>+ Novo Item</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Pull-to-refresh
        >
          {/* Caso não existam itens */}
          {lista.length === 0 ? (
            <Text style={styles.empty}>Nenhum item cadastrado ainda.</Text>
          ) : (
            // Mapeia e renderiza cada item da lista
            lista.map((item, idx) => (
              <View key={item.id ?? idx} style={styles.card}>
                <Text style={styles.title}>{item.produto ?? `Item ${idx + 1}`}</Text>
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Quantidade:</Text> {item.quantidade ?? '—'}
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Preço:</Text> {item.preco ?? '—'}
                </Text>
                
                {/* Botões de ação dentro do card */}
                <View style={styles.cardButtons}>
                  {/* Botão de edição */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('Cadastro', { itemParaEditar: item })} // Passa o item para edição
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  
                  {/* Botão de exclusão */}
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

// Estilos da tela
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' },
  topButton: { width: '90%', marginVertical: 15 },
  newButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // Sombra para Android
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
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
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
    backgroundColor: '#ff9800', // Laranja
  },
  deleteButton: {
    backgroundColor: '#d32f2f', // Vermelho
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
