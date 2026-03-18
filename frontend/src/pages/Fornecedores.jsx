import React, { useState, useEffect } from 'react';
import { fornecedorService } from '../services/api';
import './Fornecedores.css';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    setLoading(true);
    try {
      const response = await fornecedorService.listar();
      setFornecedores(response.data);
    } catch (erro) {
      console.error('Erro ao carregar fornecedores:', erro);
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
        await fornecedorService.atualizar(editando, form);
        setEditando(null);
      } else {
        await fornecedorService.criar(form);
      }
      setForm({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
      });
      carregarFornecedores();
    } catch (erro) {
      console.error('Erro ao salvar fornecedor:', erro);
    }
  };

  const handleEditar = (fornecedor) => {
    setForm(fornecedor);
    setEditando(fornecedor.id);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este fornecedor?')) {
      try {
        await fornecedorService.deletar(id);
        carregarFornecedores();
      } catch (erro) {
        console.error('Erro ao deletar fornecedor:', erro);
      }
    }
  };

  return (
    <div className="fornecedores-container">
      <h1>Gerenciar Fornecedores</h1>

      <form onSubmit={handleSubmit} className="form-fornecedor">
        <h2>{editando ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
        
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
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
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
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleInputChange}
        />
        
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChange={handleInputChange}
        />
        
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleInputChange}
          maxLength="2"
        />
        
        <input
          type="text"
          name="cep"
          placeholder="CEP"
          value={form.cep}
          onChange={handleInputChange}
        />
        
        <button type="submit">{editando ? 'Atualizar' : 'Criar'}</button>
        {editando && (
          <button type="button" onClick={() => {
            setEditando(null);
            setForm({
              nome: '',
              cnpj: '',
              email: '',
              telefone: '',
              endereco: '',
              cidade: '',
              estado: '',
              cep: '',
            });
          }}>Cancelar</button>
        )}
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-fornecedores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.id}</td>
                <td>{fornecedor.nome}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.email}</td>
                <td>{fornecedor.telefone}</td>
                <td>{fornecedor.cidade}</td>
                <td>
                  <button onClick={() => handleEditar(fornecedor)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(fornecedor.id)} className="btn-deletar">
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
