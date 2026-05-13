from sqlalchemy import Column, Integer, String, ForeignKey

from sqlalchemy.orm import relationship

from app.database.database import Base


class Chef(Base):

    __tablename__ = "chefs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    specialty = Column(
        String
    )

    phone = Column(
        String
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    company = relationship(
        "Company"
    )