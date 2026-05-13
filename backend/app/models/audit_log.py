from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    action = Column(String, nullable=False)
    module = Column(String, nullable=False)

    entity = Column(String)
    entity_id = Column(Integer)

    description = Column(Text)
    ip_address = Column(String)

    company = relationship("Company")
    user = relationship("User")

    created_at = Column(DateTime(timezone=True), server_default=func.now())