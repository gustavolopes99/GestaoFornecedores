from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.config import Base
import enum

class StatusFuncionario(str, enum.Enum):
    ativo = "ativo"
    inativo = "inativo"
    afastado = "afastado"

class Funcionario(Base):
    __tablename__ = "funcionarios"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False, index=True)
    cpf = Column(String(14), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    telefone = Column(String(20), nullable=True)
    departamento = Column(String(100), nullable=True)
    cargo = Column(String(100), nullable=True)
    status = Column(Enum(StatusFuncionario), default=StatusFuncionario.ativo)
    data_admissao = Column(DateTime, nullable=True)
    data_criacao = Column(DateTime, server_default=func.now())
    data_atualizacao = Column(DateTime, onupdate=func.now())
    
    # Relacionamentos
    tarefas = relationship("Tarefa", back_populates="funcionario")
