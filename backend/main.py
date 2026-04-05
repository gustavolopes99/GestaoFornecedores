from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import Base, engine, settings
from app.routes import fornecedor, funcionario, tarefa
import uvicorn

app = FastAPI(
    title="Gestão de Jobs, Tarefas e Funcionários",
    description="API para gerenciar fornecedores, tarefas e funcionários",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    """
    Tenta criar as tabelas do banco de dados na inicialização.
    Isso é movido para um evento de startup para que, se a conexão com o banco de dados
    falhar, a aplicação ainda possa iniciar e fornecer logs de erro mais claros.
    """
    print("INFO:     Attempting to create database tables...")
    Base.metadata.create_all(bind=engine)
    print("INFO:     Database tables check/creation complete.")

# Em produção, defina a variável de ambiente `CORS_ORIGINS` com os domínios do frontend
# Ex: "http://seu-dominio.com,http://www.seu-dominio.com"
cors_origins = settings.cors_origins.split(",") if settings.cors_origins else []

origins = [
    "http://localhost:3000", # Para desenvolvimento local
    *cors_origins
] if cors_origins else ["*"] # Permite tudo se não especificado, mas é mais seguro especificar

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
