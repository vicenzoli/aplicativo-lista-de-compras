import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando suas telas
import CadastroScreen from './componentes/CadastroScreen';
import HomeScreen from './componentes/HomeScreen';
import ConsultaScreen from './componentes/ConsultaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Consulta" component={ConsultaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}