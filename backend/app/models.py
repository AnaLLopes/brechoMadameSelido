from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = ""
    category: str  # 'feminino' | 'masculino' | 'infantil'
    size: Optional[str] = None   # tamanho unico, pp, p, m, ...
    number: Optional[str] = None # numeração
    price: float
    discount_percent: Optional[int] = 0
    available: bool = True
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(foreign_key="order.id")
    product_id: Optional[int] = Field(foreign_key="product.id")
    product_name: str
    product_price: float
    quantity: int = 1

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_number: str
    customer_name: str
    customer_phone: str
    payment_method: str  # dinheiro,pix,cartao-debito,cartao-credito
    delivery_method: str # uber-flash, retirada
    total: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
