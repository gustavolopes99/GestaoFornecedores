import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tarefaService, funcionarioService, fornecedorService } from '../services/api';
import './Home.css';

export default function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loadingTarefas, setLoadingTarefas] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoadingTarefas(true);
    try {
      const [resTarefas, resFuncionarios, resFornecedores] = await Promise.all([
        tarefaService.listar(),
        funcionarioService.listar(),
        fornecedorService.listar(),
      ]);
      setTarefas(resTarefas.data);
      setFuncionarios(resFuncionarios.data);
      setFornecedores(resFornecedores.data);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setLoadingTarefas(false);
    }
  };

  const getNomeCriador = (criador_id) => {
    const f = funcionarios.find(f => f.id === criador_id);
    return f ? f.nome : null;
  };

  const getNomeFornecedor = (fornecedor_id) => {
    const f = fornecedores.find(f => f.id === fornecedor_id);
    return f ? f.nome : null;
  };

  const formatarValor = (valor) => {
    if (!valor) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarPrazo = (prazo) => {
    if (!prazo) return null;
    return new Date(prazo).toLocaleDateString('pt-BR');
  };

  const statusConfig = {
    pendente:     { label: 'Pendente',     cor: '#e65100', bg: '#fff3e0', icone: '⏳' },
    em_progresso: { label: 'Em Progresso', cor: '#1565c0', bg: '#e3f2fd', icone: '🔄' },
    concluida:    { label: 'Concluída',    cor: '#2e7d32', bg: '#e8f5e9', icone: '✅' },
    cancelada:    { label: 'Cancelada',    cor: '#880e4f', bg: '#fce4ec', icone: '❌' },
  };

  const prioridadeConfig = {
    baixa:   { cor: '#388e3c', bg: '#e8f5e9' },
    media:   { cor: '#1976d2', bg: '#e3f2fd' },
    alta:    { cor: '#f57f17', bg: '#fff8e1' },
    urgente: { cor: '#c62828', bg: '#fce4ec' },
  };

  const tarefasFiltradas = filtroStatus === 'todos'
    ? tarefas
    : tarefas.filter(t => t.status === filtroStatus);

  const contagens = {
    pendente:     tarefas.filter(t => t.status === 'pendente').length,
    em_progresso: tarefas.filter(t => t.status === 'em_progresso').length,
    concluida:    tarefas.filter(t => t.status === 'concluida').length,
    cancelada:    tarefas.filter(t => t.status === 'cancelada').length,
  };

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Gestão de Jobs</h1>
        <p>Gerenciamento de criadores, tarefas e fornecedores</p>
      </div>

      {/* Cards de navegação */}
      <div className="cards-container">
        <div className="card">
          <h2>Fornecedores</h2>
          <p>Cadastre e edite os fornecedores</p>
          <Link to="/fornecedores" className="btn-primary">Acessar</Link>
        </div>
        <div className="card">
          <h2>Criadores</h2>
          <p>Controle sua equipe</p>
          <Link to="/funcionarios" className="btn-primary">Acessar</Link>
        </div>
        <div className="card">
          <h2>Jobs</h2>
          <p>Organize suas tarefas e prazos</p>
          <Link to="/tarefas" className="btn-primary">Acessar</Link>
        </div>
      </div>

      {/* Seção de Jobs */}
      <div className="jobs-section">
        <div className="jobs-section-header">
          <h2>Jobs Recentes</h2>
          <Link to="/tarefas" className="ver-todos-link">Ver todos →</Link>
        </div>

        {/* Pills de filtro */}
        <div className="status-resumo">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              className={`status-pill ${filtroStatus === key ? 'ativo' : ''}`}
              style={filtroStatus === key ? { background: cfg.bg, color: cfg.cor, borderColor: cfg.cor } : {}}
              onClick={() => setFiltroStatus(filtroStatus === key ? 'todos' : key)}
            >
              {cfg.icone} {cfg.label}
              <span className="status-count">{contagens[key]}</span>
            </button>
          ))}
          {filtroStatus !== 'todos' && (
            <button className="status-pill limpar" onClick={() => setFiltroStatus('todos')}>
              ✕ Limpar filtro
            </button>
          )}
        </div>

        {loadingTarefas ? (
          <p className="loading-text">Carregando jobs...</p>
        ) : tarefasFiltradas.length === 0 ? (
          <div className="jobs-vazio">
            <p>Nenhum job encontrado.</p>
            <Link to="/tarefas" className="btn-primary">Criar primeiro job</Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {tarefasFiltradas.map(tarefa => {
              const st = statusConfig[tarefa.status] || statusConfig.pendente;
              const pr = prioridadeConfig[tarefa.prioridade] || prioridadeConfig.media;
              const criador   = getNomeCriador(tarefa.criador_id);
              const fornecedor = getNomeFornecedor(tarefa.fornecedor_id);
              const valor  = formatarValor(tarefa.valor);
              const prazo  = formatarPrazo(tarefa.prazo);

              return (
                <div className="job-card" key={tarefa.id}>
                  <div className="job-card-top">
                    <span className="job-badge-status" style={{ background: st.bg, color: st.cor }}>
                      {st.icone} {st.label}
                    </span>
                    <span className="job-badge-prioridade" style={{ background: pr.bg, color: pr.cor }}>
                      {tarefa.prioridade}
                    </span>
                  </div>

                  <h3 className="job-titulo">#{tarefa.id} {tarefa.titulo}</h3>

                  {tarefa.descricao && (
                    <p className="job-descricao">{tarefa.descricao}</p>
                  )}

                  <div className="job-meta">
                    {criador && (
                      <div className="job-meta-item">
                        <span className="job-meta-icone">👤</span>
                        <span>{criador}</span>
                      </div>
                    )}
                    {fornecedor && (
                      <div className="job-meta-item">
                        <span className="job-meta-icone">🏢</span>
                        <span>{fornecedor}</span>
                      </div>
                    )}
                    {valor && (
                      <div className="job-meta-item job-valor">
                        <span className="job-meta-icone">💰</span>
                        <span>{valor}</span>
                      </div>
                    )}
                    {prazo && (
                      <div className="job-meta-item">
                        <span className="job-meta-icone">📅</span>
                        <span>{prazo}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}