import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fornecedores
export const fornecedorService = {
  listar: () => api.get('/fornecedores'),
  obter: (id) => api.get(`/fornecedores/${id}`),
  criar: (dados) => api.post('/fornecedores', dados),
  atualizar: (id, dados) => api.put(`/fornecedores/${id}`, dados),
  deletar: (id) => api.delete(`/fornecedores/${id}`),
};

// Funcionários
export const funcionarioService = {
  listar: () => api.get('/funcionarios'),
  obter: (id) => api.get(`/funcionarios/${id}`),
  criar: (dados) => api.post('/funcionarios', dados),
  atualizar: (id, dados) => api.put(`/funcionarios/${id}`, dados),
  deletar: (id) => api.delete(`/funcionarios/${id}`),
};

// Tarefas
export const tarefaService = {
  listar: () => api.get('/tarefas'),
  obter: (id) => api.get(`/tarefas/${id}`),
  criar: (dados) => api.post('/tarefas', dados),
  atualizar: (id, dados) => api.put(`/tarefas/${id}`, dados),
  deletar: (id) => api.delete(`/tarefas/${id}`),
};

export default api;
