import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import ListasScreen from './src/screens/ListasScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import { cores } from './src/theme';

export type RootStackParamList = {
  Login: undefined;
  RecuperarSenha: undefined;
  Listas: undefined;
  Produtos: { listaId: string; nome: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const temaNavegacao: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.foreground,
    background: cores.background,
    card: cores.background,
    text: cores.foreground,
    border: cores.border,
    notification: cores.destructive,
  },
};

function Rotas() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cores.background }}>
        <ActivityIndicator size="large" color={cores.foreground} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={temaNavegacao}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.background },
          headerTintColor: cores.foreground,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: cores.background },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Listas" component={ListasScreen} options={{ title: 'Minhas listas' }} />
            <Stack.Screen name="Produtos" component={ProdutosScreen} options={({ route }) => ({ title: route.params.nome })} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} options={{ title: '' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Rotas />
    </AuthProvider>
  );
}
