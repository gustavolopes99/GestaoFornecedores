from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.config import Base
import enum

class StatusTarefa(str, enum.Enum):
    pendente = "pendente"
    em_progresso = "em_progresso"
    concluida = "concluida"
    cancelada = "cancelada"

class PrioridadeTarefa(str, enum.Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"
    critica = "critica"

class Tarefa(Base):
    __tablename__ = "tarefas"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False, index=True)
    descricao = Column(Text, nullable=True)
    status = Column(Enum(StatusTarefa), default=StatusTarefa.pendente)
    prioridade = Column(Enum(PrioridadeTarefa), default=PrioridadeTarefa.media)
    data_vencimento = Column(DateTime, nullable=True)
    data_criacao = Column(DateTime, server_default=func.now())
    data_atualizacao = Column(DateTime, onupdate=func.now())
    
    # Chaves estrangeiras
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=True)
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"), nullable=True)
    
    # Relacionamentos
    fornecedor = relationship("Fornecedor", back_populates="tarefas")
    funcionario = relationship("Funcionario", back_populates="tarefas")
