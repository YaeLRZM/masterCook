from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    client_name = Column(String, nullable=False)
    client_email = Column(String)
    client_phone = Column(String)

    event_date = Column(DateTime, nullable=False)
    guests = Column(Integer, nullable=False)

    status = Column(String, default="PENDING")
    notes = Column(Text)

    total_cost = Column(Float, default=0)
    total_price = Column(Float, default=0)
    profit = Column(Float, default=0)

    company = relationship("Company")
    creator = relationship("User")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())