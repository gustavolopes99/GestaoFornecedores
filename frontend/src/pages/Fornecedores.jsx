import React, { useState, useEffect } from 'react';
import { fornecedorService } from '../services/api';
import InputMasked from '../components/InputMasked';
import { 
  formatarCNPJ, 
  formatarTelefone, 
  formatarCEP,
  validarCNPJ
} from '../utils/mascaras';
import './Fornecedores.css';

export default function Fornecedores() {
  const [erros, setErros] = useState({});
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valorFormatado = name === 'telefone' ? formatarTelefone(value) : value;  
    setForm({ ...form, [name]: valorFormatado });
    // Limpar erro do campo quando usuário começa a digitar
    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const handleBlurCNPJ = (e) => {
    const cnpj = e.target.value;
    if (cnpj && !validarCNPJ(cnpj)) {
      setErros({ ...erros, cnpj: 'CNPJ inválido' });
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!form.cnpj.trim()) novosErros.cnpj = 'CNPJ é obrigatório';
    else if (!validarCNPJ(form.cnpj)) novosErros.cnpj = 'CNPJ inválido';
    
    if (!form.email.trim()) novosErros.email = 'Email é obrigatório';
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
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
      setErros({ submit: 'Erro ao salvar. Tente novamente.' });
    }
  };

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
        
        <InputMasked
          name="nome"
          placeholder="Nome (máx 100 caracteres)"
          value={form.nome}
          onChange={handleInputChange}
          maxLength="100"
          error={erros.nome}
          required
        />
        
        <InputMasked
          name="cnpj"
          placeholder="CNPJ (XX.XXX.XXX/0001-XX)"
          value={form.cnpj}
          onChange={handleInputChange}
          maskFunction={formatarCNPJ}
          maxLength="18"
          onBlur={handleBlurCNPJ}
          error={erros.cnpj}
          required
        />
        
        <InputMasked
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          maxLength="100"
          error={erros.email}
          required
        />
        
        <InputMasked
          name="telefone"
          type="tel"
          placeholder="Telefone (XX)XXXXX-XXXX"
          value={form.telefone}
          onChange={handleInputChange}
          maskFunction={formatarTelefone}
          maxLength="15"
        />
        
        <InputMasked
          name="endereco"
          placeholder="Endereço (máx 150 caracteres)"
          value={form.endereco}
          onChange={handleInputChange}
          maxLength="150"
          className="input-fullwidth"
        />
        
        <InputMasked
          name="cidade"
          placeholder="Cidade (máx 50 caracteres)"
          value={form.cidade}
          onChange={handleInputChange}
          maxLength="50"
        />
        
        <InputMasked
          name="estado"
          placeholder="Estado (XX)"
          value={form.estado}
          onChange={handleInputChange}
          maxLength="2"
        />
        
        <InputMasked
          name="cep"
          placeholder="CEP (XXXXX-XXX)"
          value={form.cep}
          onChange={handleInputChange}
          maskFunction={formatarCEP}
          maxLength="9"
        />
        
        <button type="submit">{editando ? 'Atualizar' : 'Criar'} Fornecedor</button>
        {erros.submit && <div className="error-message">{erros.submit}</div>}
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-fornecedores">
          <thead>
            <tr>
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
                <td>{fornecedor.nome}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.email}</td>
                <td>{fornecedor.telefone}</td>
                <td>{fornecedor.cidade}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEditar(fornecedor)}>
                    Editar
                  </button>
                  <button className="btn-deletar" onClick={() => handleDeletar(fornecedor.id)}>
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