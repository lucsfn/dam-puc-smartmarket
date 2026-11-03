export const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Aceita "4,50" ou "4.50"
export const parseNumero = (texto: string) => Number(texto.replace(',', '.').trim());

export function mensagemErroAuth(code?: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/missing-password':
      return 'Informe a senha.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet.';
    default:
      return 'Ocorreu um erro. Tente novamente.';
  }
}
