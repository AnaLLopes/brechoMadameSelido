from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session
from .database import init_db, get_session
from . import crud, schemas, models
from .initial_data import seed

app = FastAPI(title="Madame Selido API")

@app.on_event("startup")
def startup():
    init_db()
    seed()

@app.get("/products", response_model=list[schemas.ProductRead])
def list_products(available: bool = True, session: Session = Depends(get_session)):
    return crud.get_products(session, available_only=available)

@app.get("/products/{product_id}", response_model=schemas.ProductCreate)
def get_product(product_id: int, session: Session = Depends(get_session)):
    p = crud.get_product(session, product_id)
    if not p:
        raise HTTPException(404, "Produto não encontrado")
    return p

@app.post("/products", response_model=schemas.ProductRead)
def create_product(p: schemas.ProductCreate, session: Session = Depends(get_session)):
    return crud.create_product(session, p)

@app.put("/products/{product_id}", response_model=schemas.ProductRead)
def update_product(product_id: int, p: schemas.ProductCreate, session: Session = Depends(get_session)):
    return crud.update_product(session, product_id, p.dict())

@app.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    crud.delete_product(session, product_id)
    return {"ok": True}

@app.post("/orders", response_model=schemas.OrderRead)
def create_order(order: schemas.OrderCreate, session: Session = Depends(get_session)):
    return crud.create_order(session, order)

@app.get("/admin/metrics")
def metrics(year: int, month: int, session: Session = Depends(get_session)):
    return crud.sales_metrics_month(session, year, month)
