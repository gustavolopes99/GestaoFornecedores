from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
from decimal import Decimal

class StatusTarefa(str, Enum):
    pendente = "pendente"
    em_progresso = "em_progresso"
    concluida = "concluida"
    cancelada = "cancelada"

class PrioridadeTarefa(str, Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"
    urgente = "urgente"

class TarefaBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    status: StatusTarefa = StatusTarefa.pendente
    prioridade: PrioridadeTarefa = PrioridadeTarefa.media
    prazo: Optional[datetime] = None
    valor: Optional[Decimal] = None
    fornecedor_id: Optional[int] = None
    criador_id: Optional[int] = None

class TarefaCreate(TarefaBase):
    pass

class TarefaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[StatusTarefa] = None
    prioridade: Optional[PrioridadeTarefa] = None
    prazo: Optional[datetime] = None
    valor: Optional[Decimal] = None
    fornecedor_id: Optional[int] = None
    criador_id: Optional[int] = None

class TarefaResponse(TarefaBase):
    id: int
    data_criacao: Optional[datetime] = None
    data_atualizacao: Optional[datetime] = None

    class Config:
        from_attributes = True