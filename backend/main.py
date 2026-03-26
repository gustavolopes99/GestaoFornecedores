from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import Base, engine, settings
from app.routes import fornecedor, funcionario, tarefa
import uvicorn

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gestão de Jobs, Tarefas e Funcionários",
    description="API para gerenciar fornecedores, tarefas e funcionários",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(fornecedor.router)
app.include_router(funcionario.router)
app.include_router(tarefa.router)

@app.get("/")
def read_root():
    return {
        "mensagem": "Bem-vindo à API de Gestão de Jobs",
        "documentação": "/docs",
        "status": "ativo"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
