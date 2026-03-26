import React, { useState, useEffect } from 'react';
import { funcionarioService } from '../services/api';
import './Funcionarios.css';
import InputMasked from '../components/InputMasked';
import { 
  formatarCPF,
  validarCPF,
  formatarTelefone,
  desformatar
} from '../utils/mascaras';
import './Fornecedores.css';

export default function Funcionarios() {
  const [erros, setErros] = useState({});
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
    let valorProcessado = value;
    if (name === 'cpf') valorProcessado = formatarCPF(value);
    if (name === 'telefone') valorProcessado = formatarTelefone(value);
    
    setForm({ ...form, [name]: valorProcessado });

    if (erros[name]) {
      setErros(prev => {
        const { [name]: removido, ...resto } = prev;
        return resto;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dadosParaEnviar = {
    ...form,
    cpf: desformatar(form.cpf),
    telefone: desformatar(form.telefone),
    data_admissao: form.data_admissao ? `${form.data_admissao}T00:00:00` : null
  };

  try {
    if (editando) {
      // Envia os dados limpos
      await funcionarioService.atualizar(editando, dadosParaEnviar);
    } else {
      // Envia os dados limpos
      await funcionarioService.criar(dadosParaEnviar);
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
      setErros({});
    } catch (erro) {
      console.error('Erro detalhado do backend:', erro.response?.data);
    }
  };

  const handleEditar = (funcionario) => {
    setForm(funcionario);
    setEditando(funcionario.id);
  };

  const handleBlurCPF = (e) => {
  const cpf = e.target.value;
  if (cpf && !validarCPF(cpf)) {
    setErros((prev) => ({ ...prev, cpf: 'CPF inválido' }));
  }
};

  const validarFormulario = () => {
      const novosErros = {};
      
      if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório';
      if (!form.cpf.trim()) novosErros.cpf = 'CPF é obrigatório';
      else if (!validarCPF(form.cpf)) novosErros.cpf = 'CPF inválido';      
      if (!form.email.trim()) novosErros.email = 'Email é obrigatório';
      
      setErros(novosErros);
      return Object.keys(novosErros).length === 0;
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
      <h1>Gerenciar Criador</h1>

      <form onSubmit={handleSubmit} className="form-funcionario">
        <h2>{editando ? 'Editar Criador' : 'Novo Criador'}</h2>
        
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleInputChange}
          required
        />
        
        <InputMasked
          type="text"
          name="cpf"
          placeholder="CPF (XXX.XXX.XXX-XX)"
          maxLength="14"
          value={form.cpf}
          onChange={handleInputChange}
          maskFunction={formatarCPF}
          onBlur={handleBlurCPF}
          error={erros.cpf}
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
        
        <InputMasked
          name="telefone"
          type="tel"
          placeholder="Telefone (XX)XXXXX-XXXX"
          value={form.telefone}
          onChange={handleInputChange}
          maskFunction={formatarTelefone}
          maxLength="15"
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
          placeholder="Data de admissão"
          onFocus={(e) => (e.target.type = "date")} 
          onBlur={(e) => !e.target.value && (e.target.type = "text")}
          min="1990-01-01"
          max="2100-12-31"
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
