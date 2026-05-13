from sqlalchemy import Column, Integer, ForeignKey, Float, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)

    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)

    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    unit_cost = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    recipe = relationship("Recipe")
    ingredient = relationship("Ingredient")