from sqlalchemy import Column, Integer, String
from app.database import Base

class Bill(Base):
    __tablename__ = "bills"
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String)
    description = Column(String)
    total_amount = Column(Integer)
    status = Column(String)
    patient_id = Column(Integer)
