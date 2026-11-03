import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { Lista, criarLista, excluirLista, observarListas } from '../services/listas';
import { cores, raio } from '../theme';
import { Alerta, Button, Card, Input, Tela } from '../components/ui';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Listas'>;

function confirmar(titulo: string, aoConfirmar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(titulo)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, undefined, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
  ]);
}

export default function ListasScreen({ navigation }: Props) {
  const { user, sair } = useAuth();
  const uid = user!.uid;
  const [listas, setListas] = useState<Lista[]>([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button variant="ghost" size="sm" onPress={sair}>
          Sair
        </Button>
      ),
    });
  }, [navigation, sair]);

  useEffect(() => observarListas(uid, setListas, () => setErro('Não foi possível carregar as listas.')), [uid]);

  async function adicionar() {
    const n = nome.trim();
    if (!n) return;
    setNome('');
    try {
      await criarLista(uid, n);
    } catch {
      setErro('Não foi possível criar a lista.');
    }
  }

  return (
    <Tela>
      <View style={{ width: '100%', maxWidth: 640, alignSelf: 'center', flex: 1, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Input
            style={{ flex: 1 }}
            placeholder="Nova lista (ex.: Compras da semana)"
            value={nome}
            onChangeText={setNome}
            onSubmitEditing={adicionar}
          />
          <Button onPress={adicionar}>+ Criar</Button>
        </View>

        {!!erro && <Alerta>{erro}</Alerta>}

        <FlatList
          data={listas}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
          ListEmptyComponent={
            <View
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: cores.border,
                borderRadius: raio.lg,
                padding: 32,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ color: cores.foreground, fontWeight: '600' }}>Nenhuma lista ainda</Text>
              <Text style={{ color: cores.mutedForeground, fontSize: 13, textAlign: 'center' }}>
                Crie a primeira lista de compras no campo acima.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('Produtos', { listaId: item.id, nome: item.nome })}
              style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            >
              <Card
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  paddingLeft: 16,
                  paddingRight: 10,
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500', color: cores.foreground, flex: 1 }}>
                  {item.nome}
                </Text>
                <Button
                  variant="destructive"
                  size="sm"
                  onPress={() => confirmar(`Excluir "${item.nome}"?`, () => excluirLista(uid, item.id))}
                >
                  Excluir
                </Button>
              </Card>
            </Pressable>
          )}
        />
      </View>
    </Tela>
  );
}
