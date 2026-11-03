import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import {
  Produto,
  adicionarProduto,
  editarProduto,
  excluirProduto,
  observarProdutos,
  totalLista,
  totalProduto,
} from '../services/listas';
import { moeda, parseNumero } from '../utils/format';
import { cores, raio } from '../theme';
import { Alerta, Badge, Button, Card, CardContent, Input, Label, Tela } from '../components/ui';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Produtos'>;

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

export default function ProdutosScreen({ route }: Props) {
  const { listaId } = route.params;
  const { user } = useAuth();
  const uid = user!.uid;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [qtd, setQtd] = useState('1');
  const [preco, setPreco] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  useEffect(
    () => observarProdutos(uid, listaId, setProdutos, () => setErro('Não foi possível carregar os produtos.')),
    [uid, listaId],
  );

  // Recalculado a cada mudança da lista (snapshots em tempo real)
  const total = useMemo(() => totalLista(produtos), [produtos]);

  // Pré-visualização do total do item sendo digitado
  const qtdNum = parseNumero(qtd);
  const precoNum = parseNumero(preco);
  const previa = qtdNum > 0 && precoNum >= 0 ? totalProduto({ quantidade: qtdNum, precoUnitario: precoNum }) : 0;

  function limpar() {
    setNome('');
    setQtd('1');
    setPreco('');
    setEditandoId(null);
  }

  async function salvar() {
    setErro('');
    const n = nome.trim();
    if (!n) return setErro('Informe o nome do produto.');
    if (!(qtdNum > 0)) return setErro('Quantidade deve ser maior que zero.');
    if (preco.trim() === '' || !(precoNum >= 0)) return setErro('Informe um preço válido.');

    const dados = { nomeProduto: n, quantidade: qtdNum, precoUnitario: precoNum };
    try {
      if (editandoId) await editarProduto(uid, listaId, editandoId, dados);
      else await adicionarProduto(uid, listaId, dados);
      limpar();
    } catch {
      setErro('Não foi possível salvar o produto.');
    }
  }

  function iniciarEdicao(p: Produto) {
    setEditandoId(p.id);
    setNome(p.nomeProduto);
    setQtd(String(p.quantidade));
    setPreco(String(p.precoUnitario).replace('.', ','));
    setErro('');
  }

  return (
    <Tela>
      <View style={{ width: '100%', maxWidth: 640, alignSelf: 'center', flex: 1, gap: 12 }}>
        <Card>
          <CardContent style={{ padding: 16, paddingTop: 16 }}>
            <View style={{ gap: 8 }}>
              <Label>Produto</Label>
              <Input placeholder="Ex.: Arroz 5kg" value={nome} onChangeText={setNome} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <Label>Qtd</Label>
                <Input placeholder="1" keyboardType="decimal-pad" value={qtd} onChangeText={setQtd} />
              </View>
              <View style={{ flex: 2, gap: 8 }}>
                <Label>Preço unitário (R$)</Label>
                <Input placeholder="0,00" keyboardType="decimal-pad" value={preco} onChangeText={setPreco} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: cores.mutedForeground, fontSize: 13 }}>Subtotal do item</Text>
              <Text style={{ color: cores.foreground, fontWeight: '600' }}>{moeda(previa)}</Text>
            </View>

            {!!erro && <Alerta>{erro}</Alerta>}

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button style={{ flex: 1 }} onPress={salvar}>
                {editandoId ? 'Salvar alterações' : 'Adicionar'}
              </Button>
              {editandoId && (
                <Button variant="outline" onPress={limpar}>
                  Cancelar
                </Button>
              )}
            </View>
          </CardContent>
        </Card>

        <FlatList
          style={{ flex: 1 }}
          data={produtos}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ gap: 8 }}
          ListEmptyComponent={
            <View
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: cores.border,
                borderRadius: raio.lg,
                padding: 28,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: cores.mutedForeground, fontSize: 13 }}>Nenhum produto nesta lista.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const editando = editandoId === item.id;
            return (
              <Card style={[{ padding: 14, gap: 10 }, editando && { borderColor: cores.ring }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: cores.foreground }}>
                      {item.nomeProduto}
                    </Text>
                    <Badge>
                      {item.quantidade} × {moeda(item.precoUnitario)}
                    </Badge>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: cores.success }}>
                    {moeda(totalProduto(item))}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="outline" size="sm" onPress={() => iniciarEdicao(item)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPress={() =>
                      confirmar(`Excluir "${item.nomeProduto}"?`, () => {
                        if (editandoId === item.id) limpar();
                        excluirProduto(uid, listaId, item.id);
                      })
                    }
                  >
                    Excluir
                  </Button>
                </View>
              </Card>
            );
          }}
        />

        <Card
          style={{
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: cores.muted,
          }}
        >
          <View>
            <Text style={{ color: cores.mutedForeground, fontSize: 13 }}>Total da lista</Text>
            <Text style={{ color: cores.mutedForeground, fontSize: 12 }}>
              {produtos.length} {produtos.length === 1 ? 'item' : 'itens'}
            </Text>
          </View>
          <Text style={{ color: cores.foreground, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
            {moeda(total)}
          </Text>
        </Card>
      </View>
    </Tela>
  );
}
