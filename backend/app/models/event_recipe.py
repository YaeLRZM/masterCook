from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.database.database import Base


class EventRecipe(Base):
    __tablename__ = "event_recipes"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)

    quantity = Column(Integer, default=1)
    portions = Column(Integer, nullable=False)

    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    event = relationship("Event")
    recipe = relationship("Recipe")