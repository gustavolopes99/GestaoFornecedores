import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Gestão de Fornecedores</h1>
        <p>Sistema integrado para gerenciar fornecedores, tarefas e funcionários</p>
      </div>

      <div className="cards-container">
        <div className="card">
          <h2>Fornecedores</h2>
          <p>Cadastre e gerencie seus fornecedores</p>
          <Link to="/fornecedores" className="btn-primary">
            Acessar
          </Link>
        </div>

        <div className="card">
          <h2>Funcionários</h2>
          <p>Controle seus funcionários e equipes</p>
          <Link to="/funcionarios" className="btn-primary">
            Acessar
          </Link>
        </div>

        <div className="card">
          <h2>Tarefas</h2>
          <p>Organize suas tarefas e prazos</p>
          <Link to="/tarefas" className="btn-primary">
            Acessar
          </Link>
        </div>
      </div>
    </div>
  );
}
