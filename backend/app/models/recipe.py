from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    category = Column(String)
    description = Column(Text)
    instructions = Column(Text)

    servings = Column(Integer, default=1)
    preparation_time = Column(Integer)

    total_cost = Column(Float, default=0)
    sale_price = Column(Float, default=0)
    profit_margin = Column(Float, default=0)

    is_active = Column(Boolean, default=True)

    company = relationship("Company")
    creator = relationship("User")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())