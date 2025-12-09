from typing import List, Optional
from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    category: str
    size: Optional[str] = None
    number: Optional[str] = None
    price: float
    discount_percent: Optional[int] = 0
    image_url: Optional[str] = None

class ProductRead(ProductCreate):
    id: int
    available: bool

class OrderItemCreate(BaseModel):
    product_id: int
    product_name: str
    product_price: float
    quantity: int = 1

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    payment_method: str
    delivery_method: str
    items: List[OrderItemCreate]

class OrderRead(BaseModel):
    id: int
    order_number: str
    total: float
