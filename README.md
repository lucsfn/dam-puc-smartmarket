# SmartMarket

Aplicativo móvel de lista de supermercado desenvolvido em **React Native (Expo)** com **Firebase Authentication** e **Cloud Firestore**.

- **Aluno:** Lucas Fernandes Nascimento
- **Disciplina:** Desenvolvimento de Aplicações Web
- **Atividade:** SmartMarket (entrega via Canvas)

## Sobre o projeto

O SmartMarket permite que o usuário crie listas de compras, registre os produtos que pretende comprar com quantidade e preço, e acompanhe em tempo real o valor total a pagar. Os dados ficam salvos na nuvem (Firestore) e cada usuário acessa somente as próprias listas.

### Funcionalidades

- Login com e-mail e senha (Firebase Authentication) e criação de conta
- Recuperação de senha por e-mail
- Criação e exclusão de listas de compras
- Criar, editar e excluir produtos de uma lista
- Cálculo automático do total de cada produto (`quantidade × precoUnitario`) e do total geral da lista, atualizados em tempo real
- Persistência da sessão: o usuário continua logado ao reabrir o app

### Modelo de dados

Estrutura no Firestore: `users/{uid}/listas/{listaId}/produtos/{produtoId}`

| Campo | Tipo | Observação |
|---|---|---|
| `nomeProduto` | string | obrigatório |
| `quantidade` | number | obrigatório, maior que 0 |
| `precoUnitario` | number | obrigatório, maior ou igual a 0 |
| `dataAdicao` | timestamp | gerado automaticamente pelo servidor |

As regras de segurança estão em [firestore.rules](firestore.rules): cada usuário só lê e escreve dentro do próprio `users/{uid}`, e os campos acima são validados no servidor.

### Telas

1. **Login** – entrada e cadastro por e-mail e senha
2. **Recuperação de senha** – envio do e-mail de redefinição
3. **Minhas listas** – listas do usuário
4. **Produtos** – produtos da lista selecionada, com o total geral exibido dinamicamente

## Tecnologias

- Expo / React Native e TypeScript
- React Navigation (native stack)
- Firebase JS SDK (Authentication e Firestore)
- AsyncStorage (persistência da sessão)

## Como criei o app

1. Criei o projeto Expo com TypeScript.
2. Criei o projeto no Firebase Console, registrei um app Web e ativei o provedor **E-mail/senha** em Authentication.
3. Criei o banco Cloud Firestore e publiquei as regras de [firestore.rules](firestore.rules).
4. Instalei o SDK `firebase` e configurei a inicialização em `src/config/firebase.ts`, lendo as credenciais de variáveis de ambiente `EXPO_PUBLIC_*`.
5. Implementei o contexto de autenticação (`src/context/AuthContext.tsx`), que controla a sessão e define quais telas ficam disponíveis.
6. Implementei o acesso ao Firestore em `src/services/listas.ts`, usando `onSnapshot` para atualizar a tela em tempo real. Os totais são calculados a partir dos dados recebidos.
7. Criei as telas em `src/screens/` e a navegação em `App.tsx`.

### Estrutura

```
App.tsx                    navegação e controle de sessão
firestore.rules            regras de segurança do Firestore
src/config/firebase.ts     inicialização do Firebase
src/context/AuthContext    estado de autenticação
src/services/listas.ts     CRUD de listas/produtos e cálculo de totais
src/screens/               Login, RecuperarSenha, Listas, Produtos
src/utils/format.ts        formatação de valores
src/theme.ts               cores
```

## Como executar

Pré-requisitos: Node.js e npm. Para testar no celular, o app **Expo Go**.

```bash
npm install
npx expo start -c
```

Depois escaneie o QR code com o Expo Go (celular e computador na mesma rede). Para rodar no navegador, instale antes `npx expo install react-dom react-native-web` e use `npm run web`.

### Configuração do Firebase

O app lê as credenciais do Firebase de variáveis de ambiente. Copie [.env.example](.env.example) para `.env` e preencha com os dados de *Configurações do projeto > Geral > Seus apps > Config do SDK* do seu projeto. No Firebase Console, ative o login por e-mail/senha em Authentication, crie o banco Cloud Firestore e publique o conteúdo de [firestore.rules](firestore.rules).

## Roteiro de teste

1. Criar uma conta com e-mail e senha e fazer login.
2. Criar uma lista e adicionar produtos com quantidade e preço.
3. Editar e excluir produtos e observar o total geral mudando na hora.
4. Fechar e reabrir o app: a sessão deve continuar ativa.
5. Sair e testar "esqueci minha senha" com um e-mail real.
