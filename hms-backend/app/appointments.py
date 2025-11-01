from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    doctor_name = Column(String)
    scheduled_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="scheduled")
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    doctor_name = Column(String)
    scheduled_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="scheduled")
