from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.config import Base

class Fornecedor(Base):
    __tablename__ = "fornecedores"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False, index=True)
    cnpj = Column(String(18), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    telefone = Column(String(20), nullable=True)
    endereco = Column(Text, nullable=True)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(2), nullable=True)
    cep = Column(String(10), nullable=True)
    ativo = Column(Boolean, default=True)
    data_criacao = Column(DateTime, server_default=func.now())
    data_atualizacao = Column(DateTime, onupdate=func.now())
    
    # Relacionamentos
    tarefas = relationship("Tarefa", back_populates="fornecedor", cascade="all, delete-orphan")
