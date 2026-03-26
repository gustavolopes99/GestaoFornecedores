import React, { useState, useEffect } from 'react';
import { tarefaService } from '../services/api';
import './Tarefas.css';
import Funcionarios from './Funcionarios';

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    status: 'pendente',
    prioridade: 'media',
    prazo: '',
    fornecedor_id: '',
    funcionario_id: '',
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const response = await tarefaService.listar();
      setTarefas(response.data);
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await tarefaService.atualizar(editando, form);
        setEditando(null);
      } else {
        await tarefaService.criar(form);
      }
      setForm({
        titulo: '',
        descricao: '',
        status: 'pendente',
        prioridade: 'media',
        prazo: '',
        fornecedor_id: '',
        funcionario_id: '',
      });
      carregarTarefas();
    } catch (erro) {
      console.error('Erro ao salvar tarefa:', erro);
    }
  };

  const handleEditar = (tarefa) => {
    setForm(tarefa);
    setEditando(tarefa.id);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        await tarefaService.deletar(id);
        carregarTarefas();
      } catch (erro) {
        console.error('Erro ao deletar tarefa:', erro);
      }
    }
  };

  return (
    <div className="tarefas-container">
      <h1>Gerenciar Jobs</h1>

      <form onSubmit={handleSubmit} className="form-tarefa">
        <h2>{editando ? 'Editar Job' : 'Novo Job'}</h2>
        
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleInputChange}
          required
        />
        
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleInputChange}
          rows="3"
        />
        
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option value="pendente">Pendente</option>
          <option value="em_progresso">Em Progresso</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>
        
        <select name="prioridade" value={form.prioridade} onChange={handleInputChange}>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Crítica</option>
        </select>

        <select name="criador_id" defaultValue="">
          <option value="" disabled>Selecione um criador</option>
          {funcionarios.map(f => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>))}
        </select>

        <input type="number" name="valor" placeholder="Valor (R$)" step="0.01"/>
        
        <input
          type="date"
          name="prazo"
          value={form.prazo}
          onChange={handleInputChange}
        />
        
        <button type="submit">{editando ? 'Atualizar' : 'Criar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setEditando(null);
            setForm({
              titulo: '',
              descricao: '',
              status: 'pendente',
              prioridade: 'media',
              prazo: '',
              fornecedor_id: '',
              funcionario_id: '',
            });
          }}>Cancelar</button>
        )}
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-tarefas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Prazo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa) => (
              <tr key={tarefa.id}>
                <td>{tarefa.id}</td>
                <td>{tarefa.titulo}</td>
                <td>{tarefa.status}</td>
                <td>{tarefa.prioridade}</td>
                <td>{tarefa.prazo}</td>
                <td>
                  <button onClick={() => handleEditar(tarefa)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(tarefa.id)} className="btn-deletar">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
