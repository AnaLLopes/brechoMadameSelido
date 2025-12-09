# optional seed data
from .database import engine
from .models import Product
from sqlmodel import Session, SQLModel

def seed():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        if s.exec("select count(*) from product").one()[0] == 0:
            items = [
                Product(name="Vestido florido", description="Vestido vintage", category="feminino", size="M", number="", price=120.0, discount_percent=10, image_url="https://via.placeholder.com/400"),
                Product(name="Camisa social", description="Camisa masculina", category="masculino", size="G", number="", price=80.0, discount_percent=0, image_url="https://via.placeholder.com/400"),
                Product(name="Conjunto bebê", description="Roupinha infantil", category="infantil", size="1", number="", price=50.0, discount_percent=5, image_url="https://via.placeholder.com/400"),
            ]
            for it in items:
                s.add(it)
            s.commit()
