import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Fornecedores from './pages/Fornecedores';
import Funcionarios from './pages/Funcionarios';
import Tarefas from './pages/Tarefas';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
