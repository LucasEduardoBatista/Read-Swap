# JavaScript separado por página — Read & Swap

Arquivos:
- common.js -> tema escuro, navbar, funções utilitárias
- index.js -> página inicial
- login.js -> login e mostrar/ocultar senha
- cadastro.js -> validação de cadastro
- configuracoes.js -> logout e exclusão da conta
- biblioteca.js -> carregamento/listagem dos livros
- editarPerfil.js -> edição de perfil + preview + Cropper
- livros.js -> cadastro de livro + Cropper
- perfil.js -> carregamento do perfil
- matches.js -> chats/matches
- swaps.js -> cards de troca, like/dislike e detalhes
- premium.js -> página Premium

IMPORTANTE NO REACT:
1. Não use <script src="javascript.js">.
2. Importe a função da página no componente React.
3. Rode a inicialização dentro de useEffect().
4. O ideal é, depois, transformar essas funções em estado/hooks do React
   (useState, useEffect, props) em vez de manipular document diretamente.
5. Os caminhos "backend/..." continuam apontando para o backend PHP.
   Se o React estiver em outro servidor/porta, ajuste para a URL/base da API.

Exemplo:

import { useEffect } from 'react';
import { inicializarComuns } from './js/common';
import { inicializarSwaps } from './js/swaps';

function Swaps() {
  useEffect(() => {
    inicializarComuns();
    inicializarSwaps();
  }, []);

  return (...);
}

export default Swaps;
