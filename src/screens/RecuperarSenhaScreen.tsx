import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { mensagemErroAuth } from '../utils/format';
import { cores } from '../theme';
import { Alerta, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '../components/ui';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'RecuperarSenha'>;

export default function RecuperarSenhaScreen({ navigation }: Props) {
  const { recuperarSenha } = useAuth();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro('');
    setSucesso(false);
    if (!email.trim()) {
      setErro('Informe seu e-mail.');
      return;
    }
    setCarregando(true);
    try {
      await recuperarSenha(email);
      setSucesso(true);
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
        <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', gap: 16 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recuperar senha</CardTitle>
              <CardDescription>Enviaremos um link de redefinição para o seu e-mail.</CardDescription>
            </CardHeader>
            <CardContent>
              <View style={{ gap: 8 }}>
                <Label>E-mail</Label>
                <Input
                  placeholder="voce@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={enviar}
                />
              </View>

              {!!erro && <Alerta>{erro}</Alerta>}
              {sucesso && <Alerta tipo="sucesso">Link enviado! Verifique sua caixa de entrada (e o spam).</Alerta>}

              <Button onPress={enviar} loading={carregando}>
                Enviar link
              </Button>
            </CardContent>
          </Card>

          <Button variant="outline" onPress={() => navigation.goBack()}>
            Voltar ao login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
