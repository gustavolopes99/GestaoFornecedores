from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.models.fornecedor import Fornecedor
from app.schemas.fornecedor import FornecedorCreate, FornecedorUpdate, FornecedorResponse

router = APIRouter(prefix="/api/fornecedores", tags=["Fornecedores"])

@router.get("", response_model=List[FornecedorResponse])
def listar_fornecedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fornecedores = db.query(Fornecedor).offset(skip).limit(limit).all()
    return fornecedores

@router.get("/{fornecedor_id}", response_model=FornecedorResponse)
def obter_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    fornecedor = db.query(Fornecedor).filter(Fornecedor.id == fornecedor_id).first()
    if not fornecedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fornecedor não encontrado")
    return fornecedor

@router.post("", response_model=FornecedorResponse, status_code=status.HTTP_201_CREATED)
def criar_fornecedor(fornecedor: FornecedorCreate, db: Session = Depends(get_db)):
    db_fornecedor = Fornecedor(**fornecedor.dict())
    db.add(db_fornecedor)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

@router.put("/{fornecedor_id}", response_model=FornecedorResponse)
def atualizar_fornecedor(fornecedor_id: int, fornecedor: FornecedorUpdate, db: Session = Depends(get_db)):
    db_fornecedor = db.query(Fornecedor).filter(Fornecedor.id == fornecedor_id).first()
    if not db_fornecedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fornecedor não encontrado")
    
    for campo, valor in fornecedor.dict(exclude_unset=True).items():
        setattr(db_fornecedor, campo, valor)
    
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

@router.delete("/{fornecedor_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    db_fornecedor = db.query(Fornecedor).filter(Fornecedor.id == fornecedor_id).first()
    if not db_fornecedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fornecedor não encontrado")
    
    db.delete(db_fornecedor)
    db.commit()
    return None
