from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum

class StatusFuncionario(str, Enum):
    ativo = "ativo"
    inativo = "inativo"
    afastado = "afastado"

class FuncionarioBase(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    telefone: Optional[str] = None
    departamento: Optional[str] = None
    cargo: Optional[str] = None
    status: StatusFuncionario = StatusFuncionario.ativo
    data_admissao: Optional[datetime] = None

class FuncionarioCreate(FuncionarioBase):
    pass

class FuncionarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    departamento: Optional[str] = None
    cargo: Optional[str] = None
    status: Optional[StatusFuncionario] = None

class FuncionarioResponse(FuncionarioBase):
    id: int
    data_criacao: datetime
    data_atualizacao: Optional[datetime]
    
    class Config:
        from_attributes = True
