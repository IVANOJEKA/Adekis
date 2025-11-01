from app.receptionist import Appointment
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.billing import Bill

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def read_root():
    return {"message": "HMS backend is running"}

@router.post("/reception/walkin-bill")
def create_walkin_bill(service: str, description: str, total_amount: int, status: str, patient_id: int = None, db: Session = Depends(get_db)):
    bill = Bill(service=service, description=description, total_amount=total_amount, status=status, patient_id=patient_id)
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill

@router.put("/reception/queue/{entry_id}/call")
def call_doctor(entry_id: int, db: Session = Depends(get_db)):
    return {"message": f"Patient {entry_id} called for service", "doctor_assigned": "Dr. Placeholder"}

@router.put("/reception/queue/{entry_id}/complete")
def complete_service(entry_id: int, db: Session = Depends(get_db)):
    return {"message": f"Service for patient {entry_id} marked as completed"}
from app.appointments import Appointment
from datetime import datetime
@router.post("/appointments/create")
def create_appointment(patient_name: str, doctor_name: str, scheduled_time: datetime, db: Session = Depends(get_db)):
    appointment = Appointment(patient_name=patient_name, doctor_name=doctor_name, scheduled_time=scheduled_time)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/appointments")
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

@router.put("/appointments/{appointment_id}/cancel")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if appointment:
        appointment.status = "cancelled"
        db.commit()
        return {"message": "Appointment cancelled"}
    return {"error": "Appointment not found"}
@router.get("/doctors")
def get_doctors(): return {"message": "Doctors module active"}

@router.get("/maternity")
def get_maternity(): return {"message": "Maternity module active"}

@router.get("/radiology")
def get_radiology(): return {"message": "Radiology module active"}

@router.get("/finance")
def get_finance(): return {"message": "Finance & Accounting module active"}

@router.get("/nursing")
def get_nursing(): return {"message": "Nursing Care Management module active"}

@router.get("/administration")
def get_administration(): return {"message": "Administration module active"}

@router.get("/hr")
def get_hr(): return {"message": "Human Resource Management module active"}

@router.get("/bed")
def get_bed(): return {"message": "Bed Management module active"}

@router.get("/settings")
def get_settings(): return {"message": "Settings module active"}

@router.get("/insurance")
def get_insurance(): return {"message": "Insurance Management module active"}
