// EXEMPLO DE USO NO REACT
// Coloque esta lógica em App.jsx ou, de preferência, em cada componente/página.
// O React não usa DOMContentLoaded para inicializar componentes.

import { useEffect } from 'react';
import { inicializarComuns } from './js/common.js';

// Em cada página:
// useEffect(() => {
//   inicializarComuns();
//   inicializarLogin(); // troque pela função da página
// }, []);

export function useProjetoComum() {
  useEffect(() => {
    inicializarComuns();
  }, []);
}
