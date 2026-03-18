import React, { useState, useEffect } from 'react';
import { funcionarioService } from '../services/api';
import './Funcionarios.css';

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    departamento: '',
    cargo: '',
    status: 'ativo',
    data_admissao: '',
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setLoading(true);
    try {
      const response = await funcionarioService.listar();
      setFuncionarios(response.data);
    } catch (erro) {
      console.error('Erro ao carregar funcionários:', erro);
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
        await funcionarioService.atualizar(editando, form);
        setEditando(null);
      } else {
        await funcionarioService.criar(form);
      }
      setForm({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        departamento: '',
        cargo: '',
        status: 'ativo',
        data_admissao: '',
      });
      carregarFuncionarios();
    } catch (erro) {
      console.error('Erro ao salvar funcionário:', erro);
    }
  };

  const handleEditar = (funcionario) => {
    setForm(funcionario);
    setEditando(funcionario.id);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este funcionário?')) {
      try {
        await funcionarioService.deletar(id);
        carregarFuncionarios();
      } catch (erro) {
        console.error('Erro ao deletar funcionário:', erro);
      }
    }
  };

  return (
    <div className="funcionarios-container">
      <h1>Gerenciar Funcionários</h1>

      <form onSubmit={handleSubmit} className="form-funcionario">
        <h2>{editando ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
        
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleInputChange}
        />
        
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={form.departamento}
          onChange={handleInputChange}
        />
        
        <input
          type="text"
          name="cargo"
          placeholder="Cargo"
          value={form.cargo}
          onChange={handleInputChange}
        />
        
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="afastado">Afastado</option>
        </select>
        
        <input
          type="date"
          name="data_admissao"
          value={form.data_admissao}
          onChange={handleInputChange}
        />
        
        <button type="submit">{editando ? 'Atualizar' : 'Criar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setEditando(null);
            setForm({
              nome: '',
              cpf: '',
              email: '',
              telefone: '',
              departamento: '',
              cargo: '',
              status: 'ativo',
              data_admissao: '',
            });
          }}>Cancelar</button>
        )}
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-funcionarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.id}</td>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cpf}</td>
                <td>{funcionario.email}</td>
                <td>{funcionario.departamento}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.status}</td>
                <td>
                  <button onClick={() => handleEditar(funcionario)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(funcionario.id)} className="btn-deletar">
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
