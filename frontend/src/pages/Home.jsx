import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Gestão de Jobs</h1>
        <p>Gerenciamento de criadores, tarefas e funcionários</p>
      </div>

      <div className="cards-container">
        <div className="card">
          <h2>Fornecedores</h2>
          <p>Cadastre e edite os fornecedores</p>
          <Link to="/fornecedores" className="btn-primary">
            Acessar
          </Link>
        </div>

        <div className="card">
          <h2>Criadores</h2>
          <p>Controle sua equipe</p>
          <Link to="/funcionarios" className="btn-primary">
            Acessar
          </Link>
        </div>

        <div className="card">
          <h2>Jobs</h2>
          <p>Organize suas tarefas e prazos</p>
          <Link to="/tarefas" className="btn-primary">
            Acessar
          </Link>

        </div>
      </div>
    </div>
  );
}
