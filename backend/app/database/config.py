from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base
from pydantic_settings import BaseSettings
from typing import Optional

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

settings = Settings()

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
