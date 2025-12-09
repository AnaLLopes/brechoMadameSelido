from sqlmodel import Session, select
from .models import Product, Order, OrderItem
from .schemas import ProductCreate, OrderCreate, OrderItemCreate
from datetime import datetime
import random
import string

def create_product(session: Session, p: ProductCreate) -> Product:
    prod = Product.from_orm(p)  # type: ignore
    session.add(prod)
    session.commit()
    session.refresh(prod)
    return prod

def get_products(session: Session, available_only: bool = True):
    q = select(Product)
    if available_only:
        q = q.where(Product.available == True)
    return session.exec(q).all()

def get_product(session: Session, product_id: int):
    return session.get(Product, product_id)

def update_product(session: Session, product_id: int, data: dict):
    prod = session.get(Product, product_id)
    for k, v in data.items():
        setattr(prod, k, v)
    session.add(prod)
    session.commit()
    session.refresh(prod)
    return prod

def delete_product(session: Session, product_id: int):
    prod = session.get(Product, product_id)
    if prod:
        session.delete(prod)
        session.commit()
    return

def generate_order_number():
    now = datetime.utcnow()
    rand = ''.join(random.choices(string.digits, k=4))
    return f"MS-{now.strftime('%Y%m%d%H%M%S')}-{rand}"

def create_order(session: Session, order: OrderCreate):
    order_number = generate_order_number()
    total = sum([item.product_price * item.quantity for item in order.items])
    order_db = Order(
        order_number=order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        payment_method=order.payment_method,
        delivery_method=order.delivery_method,
        total=total
    )
    session.add(order_db)
    session.commit()
    session.refresh(order_db)
    # add items and mark products unavailable
    for item in order.items:
        oi = OrderItem(
            order_id=order_db.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_price=item.product_price,
            quantity=item.quantity
        )
        session.add(oi)
        # mark product unavailable
        prod = session.get(Product, item.product_id)
        if prod:
            prod.available = False
            session.add(prod)
    session.commit()
    session.refresh(order_db)
    return order_db

def sales_metrics_month(session: Session, year: int, month: int):
    q = select(Order).where(
        (Order.created_at >= datetime(year, month, 1)) &
        (Order.created_at < datetime(year, month % 12 + 1, 1))
    )
    orders = session.exec(q).all()
    count = len(orders)
    total = sum([o.total for o in orders])
    return {"count": count, "total": total}
