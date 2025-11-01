from app.database import Base, engine

from app.billing import Bill
from app.appointments import Appointment
from app.lab import LabTest
from app.pharmacy import Drug
from app.staff import StaffMember
from app.emr import EMRRecord
from app.reception import ReceptionAppointment
from app.patients import Patient
from app.inventory import InventoryItem
from app.reports import Report

from app.database import Base, engine
from app.billing import Bill
from app.appointments import Appointment

Base.metadata.create_all(bind=engine)
from app.doctors import Doctor
from app.maternity import MaternityCase
from app.radiology import RadiologyScan
from app.finance import FinanceEntry
from app.nursing import NursingRecord
from app.administration import AdminTask
from app.hr import HRRecord
from app.bed import Bed
from app.settings import Setting
from app.insurance import InsurancePolicy

Base.metadata.create_all(bind=engine)


