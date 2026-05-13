from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class CompanyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)
    address: Optional[str] = Field(default=None, max_length=200)