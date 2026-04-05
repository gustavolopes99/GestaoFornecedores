# Gestão de Fornecedores, Tarefas e Funcionários

Sistema web completo para gerenciar fornecedores, tarefas e funcionários com API REST e interface moderna.

## 📋 Arquitetura

```
GestaoFornecedores/
├── backend/          # API FastAPI (Python)
├── frontend/         # Interface React
├── docker-compose.yml
└── README.md
```

## 🚀 Tecnologias

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, Vite, Axios, React Router- **Database:** Oracle Database (ou PostgreSQL)
- **Infrastructure:** Docker, Docker Compose

## 📦 Pré-requisitos

- Docker e Docker Compose
- Ou Python 3.11+ e Node.js 18+

## 🏃 Como Executar

### Opção 1: Com Docker (Recomendado)

```bash
# Clonar/navegar para o diretório
cd c:\Fontes\sistemaEco\GestaoFornecedores

# Executar com Docker Compose
docker-compose up

# A aplicação estará disponível em:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Documentação da API: http://localhost:8000/docs
```

### Opção 2: Instalação Local

#### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
.\venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações de banco de dados
# Exemplo Oracle: DATABASE_URL=oracle+oracledb://system:oracle@localhost:1521/XE

# Executar
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Executar
npm run dev
```

## 📚 Endpoints da API

### Fornecedores
- `GET /api/fornecedores` - Listar todos
- `GET /api/fornecedores/{id}` - Obter por ID
- `POST /api/fornecedores` - Criar novo
- `PUT /api/fornecedores/{id}` - Atualizar
- `DELETE /api/fornecedores/{id}` - Deletar

### Funcionários
- `GET /api/funcionarios` - Listar todos
- `GET /api/funcionarios/{id}` - Obter por ID
- `POST /api/funcionarios` - Criar novo
- `PUT /api/funcionarios/{id}` - Atualizar
- `DELETE /api/funcionarios/{id}` - Deletar

### Tarefas
- `GET /api/tarefas` - Listar todos
- `GET /api/tarefas/{id}` - Obter por ID
- `POST /api/tarefas` - Criar novo
- `PUT /api/tarefas/{id}` - Atualizar
- `DELETE /api/tarefas/{id}` - Deletar

## 📖 Documentação da API

Após iniciar o backend, acesse: `http://localhost:8000/docs`

A documentação interativa (Swagger) estará disponível para testar os endpoints.

## 🗄️ Estrutura do Banco de Dados

### Tabelas

#### fornecedores
- id (PK)
- nome
- cnpj (UNIQUE)
- email
- telefone
- endereco
- cidade
- estado
- cep
- ativo
- data_criacao
- data_atualizacao

#### funcionarios
- id (PK)
- nome
- cpf (UNIQUE)
- email
- telefone
- departamento
- cargo
- status (ativo, inativo, afastado)
- data_admissao
- data_criacao
- data_atualizacao

#### tarefas
- id (PK)
- titulo
- descricao
- status (pendente, em_progresso, concluida, cancelada)
- prioridade (baixa, media, alta, urgente)
- data_vencimento
- fornecedor_id (FK)
- funcionario_id (FK)
- data_criacao
- data_atualizacao

## 🔧 Configuração

### Backend (.env)

```env
DATABASE_URL=oracle+oracledb://system:oracle@localhost:1521/XE
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## 📝 Exemplos de Requisição

### Criar Fornecedor

```bash
curl -X POST http://localhost:8000/api/fornecedores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fornecedor XYZ",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@fornecedor.com",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua Principal, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01311-100"
  }'
```

### Criar Funcionário

```bash
curl -X POST http://localhost:8000/api/funcionarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "123.456.789-10",
    "email": "joao@empresa.com",
    "telefone": "(11) 98888-8888",
    "departamento": "TI",
    "cargo": "Desenvolvedor",
    "status": "ativo",
    "data_admissao": "2024-01-15"
  }'
```

### Criar Tarefa

```bash
curl -X POST http://localhost:8000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Revisar contrato com fornecedor",
    "descricao": "Revisar e aprovar contrato com o fornecedor XYZ",
    "status": "pendente",
    "prioridade": "alta",
    "data_vencimento": "2024-03-31T23:59:59",
    "fornecedor_id": 1,
    "funcionario_id": 1
  }'
```

## 🧪 Testes

### Backend

```bash
cd backend
pip install pytest
pytest
```

### Frontend

```bash
cd frontend
npm test
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, abra uma issue no repositório.

## 🎯 Próximos Passos

- [ ] Autenticação e autorização (JWT)
- [ ] Testes unitários e integração
- [ ] Paginação avançada
- [ ] Filtros e busca
- [ ] Relatórios e exportação (PDF, Excel)
- [ ] Dashboard com gráficos
- [ ] Notificações em tempo real
- [ ] Upload de arquivos
- [ ] Audit log

---

Desenvolvido com ❤️ usando Python e React
