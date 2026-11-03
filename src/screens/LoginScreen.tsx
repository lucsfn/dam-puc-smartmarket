import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { mensagemErroAuth } from '../utils/format';
import { cores } from '../theme';
import { Alerta, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '../components/ui';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, cadastrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await (modoCadastro ? cadastrar(email, senha) : login(email, senha));
    } catch (e: any) {
      setErro(mensagemErroAuth(e?.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', gap: 24 }}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: cores.foreground, letterSpacing: -0.8 }}>
              SmartMarket
            </Text>
            <Text style={{ color: cores.mutedForeground, fontSize: 14 }}>Suas compras, sob controle.</Text>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>{modoCadastro ? 'Criar conta' : 'Entrar'}</CardTitle>
              <CardDescription>
                {modoCadastro
                  ? 'Cadastre-se com e-mail e senha para começar.'
                  : 'Use seu e-mail e senha para acessar suas listas.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View style={{ gap: 8 }}>
                <Label>E-mail</Label>
                <Input
                  placeholder="voce@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={{ gap: 8 }}>
                <Label>Senha</Label>
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  value={senha}
                  onChangeText={setSenha}
                  onSubmitEditing={enviar}
                />
              </View>

              {!!erro && <Alerta>{erro}</Alerta>}

              <Button onPress={enviar} loading={carregando}>
                {modoCadastro ? 'Cadastrar' : 'Entrar'}
              </Button>

              {!modoCadastro && (
                <Button variant="ghost" size="sm" onPress={() => navigation.navigate('RecuperarSenha')}>
                  Esqueci minha senha
                </Button>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onPress={() => {
              setModoCadastro(!modoCadastro);
              setErro('');
            }}
          >
            {modoCadastro ? 'Já tenho conta' : 'Criar uma conta'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
