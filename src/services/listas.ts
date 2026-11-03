import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type Lista = { id: string; nome: string };

export type Produto = {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  dataAdicao: Timestamp | null;
};

export type ProdutoInput = Pick<Produto, 'nomeProduto' | 'quantidade' | 'precoUnitario'>;

// users/{uid}/listas/{listaId}/produtos/{produtoId}
const listasRef = (uid: string) => collection(db, 'users', uid, 'listas');
const produtosRef = (uid: string, listaId: string) =>
  collection(db, 'users', uid, 'listas', listaId, 'produtos');

const arredondar = (v: number) => Math.round(v * 100) / 100;

export const totalProduto = (p: Pick<Produto, 'quantidade' | 'precoUnitario'>) =>
  arredondar(p.quantidade * p.precoUnitario);

export const totalLista = (produtos: Produto[]) =>
  arredondar(produtos.reduce((soma, p) => soma + totalProduto(p), 0));

export function observarListas(
  uid: string,
  cb: (listas: Lista[]) => void,
  onError?: (e: Error) => void,
) {
  const q = query(listasRef(uid), orderBy('dataCriacao', 'desc'));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, nome: d.data().nome as string }))),
    onError,
  );
}

export const criarLista = (uid: string, nome: string) =>
  addDoc(listasRef(uid), { nome, dataCriacao: serverTimestamp() });

export const excluirLista = (uid: string, listaId: string) =>
  deleteDoc(doc(db, 'users', uid, 'listas', listaId));

export function observarProdutos(
  uid: string,
  listaId: string,
  cb: (produtos: Produto[]) => void,
  onError?: (e: Error) => void,
) {
  const q = query(produtosRef(uid, listaId), orderBy('dataAdicao', 'asc'));
  return onSnapshot(
    q,
    (snap) =>
      cb(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data({ serverTimestamps: 'estimate' }) as Omit<Produto, 'id'>),
        })),
      ),
    onError,
  );
}

export const adicionarProduto = (uid: string, listaId: string, p: ProdutoInput) =>
  addDoc(produtosRef(uid, listaId), { ...p, dataAdicao: serverTimestamp() });

export const editarProduto = (uid: string, listaId: string, id: string, p: ProdutoInput) =>
  updateDoc(doc(db, 'users', uid, 'listas', listaId, 'produtos', id), { ...p });

export const excluirProduto = (uid: string, listaId: string, id: string) =>
  deleteDoc(doc(db, 'users', uid, 'listas', listaId, 'produtos', id));
