# Manual Test Scripts

## 1. Patient Registration & Admission
**Goal**: Verify a new patient can be registered and admitted.

1.  **Login** as Receptionist/Admin.
2.  Navigate to **Patients** dashboard.
3.  Click **"Add New Patient"**.
4.  Fill in required details (Name, DOB, Gender, Phone).
5.  **Submit**. Verify patient appears in the list.
6.  Click on the new patient to view details.
7.  **Verify** data matches input.

## 2. Appointment Scheduling & Consultation
**Goal**: Verify the flow from booking to doctor consultation.

1.  **Login** as Receptionist.
2.  Navigate to **Appointments**.
3.  Click **"New Appointment"**.
4.  Select the patient created in Test 1.
5.  Select a Doctor and Date/Time.
6.  **Submit**. Verify appointment appears in the calendar/list.
7.  **Login** as the assigned Doctor.
8.  Navigate to **Doctor Dashboard**.
9.  Verify the appointment appears in "Today's Appointments".
10. Click **"Start Consultation"**.
11. Enter Vitals, Diagnosis, and Prescription.
12. **Finish Consultation**. Verify status changes to "Completed".

## 3. Lab Order & Result Entry
**Goal**: Verify lab workflow.

1.  **Login** as Doctor (or use the previous session).
2.  Navigate to **Laboratory** (or order from Consultation).
3.  Click **"New Test Order"**.
4.  Select Patient and Test Type (e.g., CBC).
5.  **Submit**.
6.  **Login** as Lab Technician.
7.  Navigate to **Laboratory Dashboard**.
8.  Verify the new order is "Pending".
9.  Click **"Collect Sample"**. Verify status -> "Sample Collected".
10. Click **"Enter Results"**. Fill in mock results.
11. **Submit**. Verify status -> "Completed".

## 4. Billing & Payment
**Goal**: Verify financial transactions.

1.  **Login** as Cashier/Admin.
2.  Navigate to **Finance Dashboard**.
3.  Click **"New Bill"** (or check pending bills from Lab/Consultation).
4.  Select Patient.
5.  Add items (Consultation Fee, Lab Test).
6.  **Save Bill**.
7.  Select the bill and click **"Record Payment"**.
8.  Enter amount and payment method (Cash).
9.  **Submit**. Verify bill status -> "Paid".

## 5. Pharmacy Dispensing
**Goal**: Verify medication dispensing.

1.  **Login** as Pharmacist.
2.  Navigate to **Pharmacy Dashboard**.
3.  Check **"Prescription Requests"**.
4.  Find the prescription from Test 2.
5.  Click **"Dispense"**.
6.  **Confirm**. Verify stock deduction (if inventory linked) and status change.
