from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base
from pydantic_settings import BaseSettings
from pydantic import ValidationError
from typing import Optional
import sys

class Settings(BaseSettings):
    """
    Gerencia as configurações da aplicação, lendo de variáveis de ambiente ou de um arquivo .env.
    """
    # Obrigatório: Lançará um erro claro se não for definido no ambiente.
    # Ex: postgresql+psycopg2://user:password@host:port/dbname
    database_url: str

    # Opcionais com valores padrão, seguros para produção.
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    cors_origins: Optional[str] = None

    class Config:
        # Diz ao Pydantic para ler o arquivo .env se as variáveis não estiverem no ambiente.
        env_file = ".env"
        env_file_encoding = "utf-8"

try:
    settings = Settings()
except ValidationError as e:
    # Imprime uma mensagem de erro muito mais clara nos logs, facilitando o debug em produção.
    print("="*80)
    print("!!! ERRO DE CONFIGURAÇÃO: Variáveis de ambiente ausentes ou inválidas. !!!")
    print("="*80)
    print("A aplicação não pôde ser iniciada devido a um erro de validação do Pydantic.")
    print(f"--> Detalhes do erro: {e}")
    print("--> Ação necessária: Verifique se todas as variáveis de ambiente obrigatórias (ex: DATABASE_URL) estão definidas corretamente no seu ambiente de deploy (Render).")
    print("="*80)
    # Encerra a aplicação para evitar que ela continue em um estado inválido.
    sys.exit(1)

try:
    engine = create_engine(settings.database_url)
except Exception as e:
    # Captura erros como drivers de banco de dados ausentes (ex: usar uma URL Oracle sem 'oracledb' instalado).
    print("="*80)
    print("!!! ERRO AO INICIALIZAR O ENGINE DO BANCO DE DADOS (create_engine) !!!")
    print("="*80)
    print("A aplicação falhou ao configurar a conexão com o banco de dados.")
    
    # Oculta a senha da URL nos logs para segurança
    safe_url = str(settings.database_url)
    if '@' in safe_url and ':' in safe_url.split('@')[0]:
        user_pass_part = safe_url.split('://')[1].split('@')[0]
        safe_url = safe_url.replace(user_pass_part, f"{user_pass_part.split(':')[0]}:****")

    print(f"--> URL configurada: {safe_url}")
    print(f"--> Detalhes do erro: {e}")
    print("--> Causa Provável: A 'DATABASE_URL' usa um dialeto (ex: 'oracle://') para o qual o driver não está instalado em 'requirements.txt'.")
    print("--> Ação Necessária: Garanta que a DATABASE_URL corresponde ao driver instalado (ex: 'postgresql://' para 'psycopg2-binary').")
    print("="*80)
    sys.exit(1)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
