import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity
} from 'react-native';

// URL base da sua API mock (MockAPI) que armazena os itens da lista de compras
const BASE_URL = 'https://68f0e8fe0b966ad50034ade2.mockapi.io/ListaCompras/';

export default function CadastroScreen({ route, navigation }) {
  // Estado para armazenar os valores do formulário
  const [produto, setProduto] = useState('');       // Nome do item
  const [preco, setPreco] = useState('');           // Preço do item
  const [quantidade, setQuantidade] = useState(''); // Quantidade do item
  const [loading, setLoading] = useState(false);    // Estado de carregamento da requisição

  // useEffect é executado quando a tela é montada ou quando os parâmetros da rota mudam
  useEffect(() => {
    // Configura o título da tela dinamicamente dependendo se é edição ou cadastro
    navigation.setOptions({
        title: route.params?.itemParaEditar ? 'Editar Item' : 'Novo Cadastro'
    });

    // Se houver um item para editar, preenche os campos com os valores existentes
    if (route.params?.itemParaEditar) {
      const { produto, quantidade, preco } = route.params.itemParaEditar;
      setProduto(produto);
      setQuantidade(quantidade);
      setPreco(preco);
    } else {
        // Se não houver item para editar, limpa os campos
        setProduto(''); setQuantidade(''); setPreco('');
    }
  }, [route.params, navigation]);

  // Função chamada quando o usuário clica no botão de cadastrar/atualizar
  async function handleSubmit() {
    // Validação simples: campo produto não pode estar vazio
    if (!produto.trim()) {
      Alert.alert('Erro', 'Preencha o campo Item.');
      return;
    }

    // Cria o objeto que será enviado para a API
    const payload = {
      produto: produto.trim(),
      quantidade: quantidade.trim(),
      preco: preco.trim()
    };

    setLoading(true); // Ativa o indicador de carregamento

    try {
      let res;      // Variável para armazenar a resposta da requisição
      let url;      // URL da requisição
      let method;   // Método HTTP (POST para criar, PUT para atualizar)

      // Se houver item para editar, atualiza
      if (route.params?.itemParaEditar) {
        const id = route.params.itemParaEditar.id;   // ID do item a ser atualizado
        url = `${BASE_URL}${id}`;                    // URL da API para PUT
        method = 'PUT';                              // Método PUT para atualizar
      } else {
        // Caso contrário, cria novo item
        url = BASE_URL;      // URL base para POST
        method = 'POST';     // Método POST para criar
      }

      // Faz a requisição para a API usando fetch
      res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json' // Indica que estamos enviando JSON
        },
        body: JSON.stringify(payload)         // Converte objeto JS para JSON
      });

      // Se a requisição for bem-sucedida
      if (res.ok) {
        Alert.alert('Sucesso', route.params?.itemParaEditar ? 'Item atualizado!' : 'Item cadastrado!');
        navigation.navigate('Consulta'); // Volta para a tela de consulta/lista
      } else {
        // Se houver algum erro na resposta
        Alert.alert('Erro', `Falha na requisição. Status: ${res.status}`);
      }
    } catch (err) {
      // Captura erros de rede ou outros problemas
      Alert.alert('Erro de rede', String(err));
    } finally {
      // Sempre desativa o loading independente do sucesso ou falha
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Campo para o nome do item */}
      <Text style={styles.label}>Item</Text>
      <TextInput 
        style={styles.input} 
        value={produto} 
        onChangeText={setProduto} 
        placeholder="Ex: Maçã, Detergente" 
      />

      {/* Campo para a quantidade */}
      <Text style={styles.label}>Quantidade</Text>
      <TextInput 
        style={styles.input} 
        value={quantidade} 
        onChangeText={setQuantidade} 
        placeholder="Ex: 5" 
        keyboardType="numeric" // Exibe teclado numérico
      />

      {/* Campo para o preço */}
      <Text style={styles.label}>Preço</Text>
      <TextInput 
        style={styles.input} 
        value={preco} 
        onChangeText={setPreco} 
        placeholder="Ex: 49.90" 
        keyboardType="numeric" // Exibe teclado numérico
      />

      {/* Exibe indicador de carregamento se loading for true */}
      {loading ? (
        <ActivityIndicator color="#1976d2" style={{ marginTop: 30 }} />
      ) : (
        <>
          {/* Botão de cadastro ou atualização */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {route.params?.itemParaEditar ? 'Atualizar Item' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          {/* Botão para voltar à lista */}
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

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', // Cor de fundo clara
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
    elevation: 1, // Sombra no Android
  },
  submitButton: {
    backgroundColor: '#4caf50', // Verde
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
