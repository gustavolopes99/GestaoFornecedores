from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class StatusTarefa(str, Enum):
    pendente = "pendente"
    em_progresso = "em_progresso"
    concluida = "concluida"
    cancelada = "cancelada"

class PrioridadeTarefa(str, Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"
    critica = "critica"

class TarefaBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    status: StatusTarefa = StatusTarefa.pendente
    prioridade: PrioridadeTarefa = PrioridadeTarefa.media
    data_vencimento: Optional[datetime] = None
    fornecedor_id: Optional[int] = None
    funcionario_id: Optional[int] = None

class TarefaCreate(TarefaBase):
    pass

class TarefaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[StatusTarefa] = None
    prioridade: Optional[PrioridadeTarefa] = None
    data_vencimento: Optional[datetime] = None
    fornecedor_id: Optional[int] = None
    funcionario_id: Optional[int] = None

class TarefaResponse(TarefaBase):
    id: int
    data_criacao: datetime
    data_atualizacao: Optional[datetime]
    
    class Config:
        from_attributes = True
