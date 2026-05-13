from pydantic import BaseModel


class ChefCreate(BaseModel):

    name: str
    specialty: str
    phone: str
    company_id: int


class ChefResponse(BaseModel):

    id: int
    name: str
    specialty: str
    phone: str
    company_id: int

    class Config:
        from_attributes = True