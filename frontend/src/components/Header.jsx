import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>API</h1>
        </div>
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/fornecedores">Fornecedores</Link>
          <Link to="/funcionarios">Criadores</Link>
          <Link to="/tarefas">Jobs</Link>
        </nav>
      </div>
    </header>
  );
}
