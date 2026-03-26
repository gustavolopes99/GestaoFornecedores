import React, { useState, useEffect } from 'react';
import { tarefaService, funcionarioService, fornecedorService } from '../services/api';
import './Tarefas.css';

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    status: 'pendente',
    prioridade: 'media',
    prazo: '',
    valor: '',
    fornecedor_id: '',
    criador_id: '',
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarTarefas();
    carregarFuncionarios();
    carregarFornecedores();
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

  const carregarFuncionarios = async () => {
    try {
      const response = await funcionarioService.listar();
      setFuncionarios(response.data.filter(f => f.status === 'ativo'));
    } catch (erro) {
      console.error('Erro ao carregar funcionários:', erro);
    }
  };

  const carregarFornecedores = async () => {
    try {
      const response = await fornecedorService.listar();
      setFornecedores(response.data.filter(f => f.ativo));
    } catch (erro) {
      console.error('Erro ao carregar fornecedores:', erro);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        titulo: form.titulo,
        descricao: form.descricao || null,
        status: form.status,
        prioridade: form.prioridade,
        prazo: form.prazo ? `${form.prazo}T00:00:00` : null,
        valor: form.valor !== '' ? parseFloat(form.valor) : null,
        fornecedor_id: form.fornecedor_id !== '' ? parseInt(form.fornecedor_id) : null,
        criador_id: form.criador_id !== '' ? parseInt(form.criador_id) : null,
      };

      if (editando) {
        await tarefaService.atualizar(editando, dadosParaEnviar);
        setEditando(null);
      } else {
        await tarefaService.criar(dadosParaEnviar);
      }

      setForm(formVazio);
      carregarTarefas();
    } catch (erro) {
      console.error('Erro ao salvar tarefa:', erro);
      console.error('Detalhes:', erro.response?.data);
    }
  };

  const handleEditar = (tarefa) => {
    const prazoFormatado = tarefa.prazo ? tarefa.prazo.split('T')[0] : '';
    setForm({
      titulo: tarefa.titulo || '',
      descricao: tarefa.descricao || '',
      status: tarefa.status || 'pendente',
      prioridade: tarefa.prioridade || 'media',
      prazo: prazoFormatado,
      valor: tarefa.valor || '',
      fornecedor_id: tarefa.fornecedor_id || '',
      criador_id: tarefa.criador_id || '',
    });
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

  const getNomeCriador = (criador_id) => {
    const f = funcionarios.find(f => f.id === criador_id);
    return f ? f.nome : '—';
  };

  const getNomeFornecedor = (fornecedor_id) => {
    const f = fornecedores.find(f => f.id === fornecedor_id);
    return f ? f.nome : '—';
  };

  const formatarValor = (valor) => {
    if (!valor) return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarPrazo = (prazo) => {
    if (!prazo) return '—';
    return new Date(prazo).toLocaleDateString('pt-BR');
  };

  const getBadgeStatus = (status) => {
    const map = { pendente: 'badge-pendente', em_progresso: 'badge-progresso', concluida: 'badge-concluida', cancelada: 'badge-cancelada' };
    return map[status] || '';
  };

  const getBadgePrioridade = (prioridade) => {
    const map = { baixa: 'badge-baixa', media: 'badge-media', alta: 'badge-alta', urgente: 'badge-urgente' };
    return map[prioridade] || '';
  };

  const formVazio = {
    titulo: '', descricao: '', status: 'pendente', prioridade: 'media',
    prazo: '', valor: '', fornecedor_id: '', criador_id: '',
  };

  return (
    <div className="tarefas-container">
      <h1>Gerenciar Jobs</h1>

      <form onSubmit={handleSubmit} className="form-tarefa">
        <h2>{editando ? 'Editar Job' : 'Novo Job'}</h2>

        <div className="form-grid">
          <input
            type="text"
            name="titulo"
            placeholder="Título do Job"
            value={form.titulo}
            onChange={handleInputChange}
            className="span-2"
            required
          />

          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleInputChange}
            rows="3"
            className="span-2"
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

          <select name="criador_id" value={form.criador_id} onChange={handleInputChange}>
            <option value="">— Selecione um Criador —</option>
            {funcionarios.map(f => (
              <option key={f.id} value={f.id}>
                {f.nome} {f.cargo ? `(${f.cargo})` : ''}
              </option>
            ))}
          </select>

          <select name="fornecedor_id" value={form.fornecedor_id} onChange={handleInputChange}>
            <option value="">— Selecione um Fornecedor —</option>
            {fornecedores.map(f => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>

          <div className="input-valor">
            <span className="prefixo-real">R$</span>
            <input
              type="number"
              name="valor"
              placeholder="0,00"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={handleInputChange}
            />
          </div>

          <input
            type="date"
            name="prazo"
            value={form.prazo}
            onChange={handleInputChange}
            min="2000-01-01"
            max="2100-12-31"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-salvar">
            {editando ? '✓ Atualizar Job' : '+ Criar Job'}
          </button>
          {editando && (
            <button type="button" className="btn-cancelar"
              onClick={() => { setEditando(null); setForm(formVazio); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-tarefas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Criador</th>
              <th>Fornecedor</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Valor</th>
              <th>Prazo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  Nenhum job cadastrado ainda.
                </td>
              </tr>
            ) : (
              tarefas.map((tarefa) => (
                <tr key={tarefa.id}>
                  <td>#{tarefa.id}</td>
                  <td><strong>{tarefa.titulo}</strong></td>
                  <td>{getNomeCriador(tarefa.criador_id)}</td>
                  <td>{getNomeFornecedor(tarefa.fornecedor_id)}</td>
                  <td>
                    <span className={`badge ${getBadgeStatus(tarefa.status)}`}>
                      {tarefa.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getBadgePrioridade(tarefa.prioridade)}`}>
                      {tarefa.prioridade}
                    </span>
                  </td>
                  <td>{formatarValor(tarefa.valor)}</td>
                  <td>{formatarPrazo(tarefa.prazo)}</td>
                  <td>
                    <button onClick={() => handleEditar(tarefa)} className="btn-editar">Editar</button>
                    <button onClick={() => handleDeletar(tarefa.id)} className="btn-deletar">Deletar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}