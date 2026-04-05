from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.models.funcionario import Funcionario
from app.schemas.funcionario import FuncionarioCreate, FuncionarioUpdate, FuncionarioResponse

router = APIRouter(prefix="/api/funcionarios", tags=["Funcionários"])

@router.get("", response_model=List[FuncionarioResponse])
def listar_funcionarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    funcionarios = db.query(Funcionario).offset(skip).limit(limit).all()
    return funcionarios

@router.get("/{funcionario_id}", response_model=FuncionarioResponse)
def obter_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not funcionario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado")
    return funcionario

@router.post("", response_model=FuncionarioResponse, status_code=status.HTTP_201_CREATED)
def criar_funcionario(funcionario: FuncionarioCreate, db: Session = Depends(get_db)):
    db_funcionario = Funcionario(**funcionario.model_dump())
    db.add(db_funcionario)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

@router.put("/{funcionario_id}", response_model=FuncionarioResponse)
def atualizar_funcionario(funcionario_id: int, funcionario: FuncionarioUpdate, db: Session = Depends(get_db)):
    db_funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not db_funcionario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado")
    
    for campo, valor in funcionario.model_dump(exclude_unset=True).items():
        setattr(db_funcionario, campo, valor)
    
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

@router.delete("/{funcionario_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    db_funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not db_funcionario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado")
    
    db.delete(db_funcionario)
    db.commit()
    return None
