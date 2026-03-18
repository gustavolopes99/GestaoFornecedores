from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class FornecedorBase(BaseModel):
    nome: str
    cnpj: str
    email: EmailStr
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None
    ativo: bool = True

class FornecedorCreate(FornecedorBase):
    pass

class FornecedorUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None
    ativo: Optional[bool] = None

class FornecedorResponse(FornecedorBase):
    id: int
    data_criacao: datetime
    data_atualizacao: Optional[datetime]
    
    class Config:
        from_attributes = True
