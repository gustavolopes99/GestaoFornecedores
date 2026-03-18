import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>GestãoApp</h1>
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/fornecedores">Fornecedores</Link>
          <Link to="/funcionarios">Funcionários</Link>
          <Link to="/tarefas">Tarefas</Link>
        </nav>
      </div>
    </header>
  );
}
