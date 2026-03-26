# Guia de Instalação e Configuração

## 📋 Pré-requisitos

- Git
- Docker e Docker Compose (opcional, mas recomendado)
- Python 3.11+ (se não usar Docker)
- Node.js 18+ (se não usar Docker)
- PostgreSQL 15+ (se não usar Docker)

## 🚀 Instalação Rápida com Docker

### 1. Pré-requisitos
Certifique-se de ter Docker e Docker Compose instalados:
```powershell
docker --version
docker-compose --version
```

### 2. Executar a Aplicação

```powershell
cd c:\Fontes\sistemaEco\GestaoFornecedores
docker-compose up -d
```

### 3. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentação API:** http://localhost:8000/docs

## 🛠️ Instalação Manual (Sem Docker)

### Backend

#### 1. Configurar Banco de Dados

Crie um banco PostgreSQL:

```sql
CREATE DATABASE gestao_fornecedores;
```

#### 2. Instalar Dependências

```powershell
cd c:\Fontes\sistemaEco\GestaoFornecedores\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Configurar Variáveis de Ambiente

```powershell
cp .env.example .env
```

Edite `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/gestao_fornecedores
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

#### 4. Executar Backend

```powershell
.\venv\Scripts\activate
uvicorn main:app --reload
```

Backend estará em: http://localhost:8000

### Frontend

#### 1. Instalar Dependências

```powershell
cd c:\Fontes\sistemaEco\GestaoFornecedores\frontend
npm install
```

#### 2. Configurar Variáveis de Ambiente

```powershell
cp .env.example .env
```

Edite `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

#### 3. Executar Frontend

```powershell
npm run dev
```

Frontend estará em: http://localhost:3000

## 🔒 Segurança (Próximos Passos)

### Implementar Autenticação

```python
# backend/app/auth.py
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from datetime import datetime, timedelta
import jwt

SECRET_KEY = "sua-chave-secreta-aqui"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### Adicionar CORS Seguro

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Especificar domínios
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 📊 Populate Database (Dados de Teste)

```bash
# backend/seeds.py
from app.database.config import SessionLocal
from app.models.fornecedor import Fornecedor
from app.models.funcionario import Funcionario
from app.models.tarefa import Tarefa, StatusTarefa, PrioridadeTarefa

db = SessionLocal()

# Adicionar fornecedor de teste
fornecedor = Fornecedor(
    nome="Fornecedor Teste",
    cnpj="12.345.678/0001-90",
    email="teste@fornecedor.com",
    telefone="(11) 99999-9999",
    cidade="São Paulo",
    estado="SP"
)
db.add(fornecedor)
db.commit()
db.refresh(fornecedor)

# Adicionar funcionário de teste
funcionario = Funcionario(
    nome="João Silva",
    cpf="123.456.789-10",
    email="joao@empresa.com",
    departamento="TI",
    cargo="Desenvolvedor"
)
db.add(funcionario)
db.commit()
db.refresh(funcionario)

# Adicionar tarefa
tarefa = Tarefa(
    titulo="Revisar contrato",
    descricao="Revisar contrato com fornecedor",
    status=StatusTarefa.pendente,
    prioridade=PrioridadeTarefa.alta,
    fornecedor_id=fornecedor.id,
    funcionario_id=funcionario.id
)
db.add(tarefa)
db.commit()

print("Dados de teste adicionados com sucesso!")
```

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"
- Verificar se PostgreSQL está rodando
- Verificar credenciais em `.env`
- Verificar se a database foi criada

### Erro: "Port already in use"
- Mudar porta em `.env` ou `docker-compose.yml`
- Ou matar o processo: `lsof -ti:8000 | xargs kill -9`

### Erro: "Module not found"
- Recriar ambiente virtual:
  ```bash
  rm -r venv
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  ```

## 📚 Estrutura de Pastas

```
GestaoFornecedores/
├── backend/
│   ├── app/
│   │   ├── models/        # Modelos ORM
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── routes/        # Rotas API
│   │   └── database/      # Config DB
│   ├── main.py            # Aplicação
│   └── requirements.txt    # Dependências
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # Serviços API
│   │   └── App.jsx        # App principal
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml     # Orchestração
└── README.md
```

## 🎓 Próximas Melhorias

1. **Autenticação JWT**
2. **Validações avançadas**
3. **Testes automatizados**
4. **Cache com Redis**
5. **Logging estruturado**
6. **CI/CD Pipeline**
7. **Monitoring e Alerts**

---

Para suporte, abra uma issue no repositório.
