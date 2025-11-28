# HR Dashboard Employee Management Integration - FINAL STEPS

## ✅ What's Already Done

1. **`src/utils/employeeIdUtils.js`** ✅ - Employee ID generation utilities
2. **`src/modules/HR/components/AddEmployeeModal.jsx`** ✅ - Add employee modal with auto-ID
3. **`src/modules/HR/components/EmployeeProfileModal.jsx`** ✅ - View/edit/delete employee modal

## 📝 Manual Integration Required (5 Minutes)

Due to file size limitations, please manually integrate the modals into `src/modules/HR/HRDashboard.jsx`:

### Step 1: Add Imports (Line 4-5)
After line 4 `import EnhancedAttendance from './components/EnhancedAttendance';`, add:
```javascript
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeProfileModal from './components/EmployeeProfileModal';
```

### Step 2: Add State (Line 39-42)
After line 39 `const [filterDepartment, setFilterDepartment] = useState('all');`, add:
```javascript
const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);
```

### Step 3: Add Handlers (Line 64-85)
After line 64 calculating `total

BenefitsCost`, add:
```javascript
// Employee Management Handlers
const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
};

const handleUpdateEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, ...updatedData } : emp
    ));
};

const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
};

const handleViewProfile = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeProfileModal(true);
};
```

### Step 4: Update "Add Employee" Button (Line 89)
Find the button around line 89, change from:
```javascript
<button className="btn btn-primary gap-2">
```
To:
```javascript
<button onClick={() => setShowAddEmployeeModal(true)} className="btn btn-primary gap-2">
```

### Step 5: Update "View Profile" Button (Line 334)
Find the "View Profile" button around line 334, change from:
```javascript
<button className="text-primary font-medium text-xs hover:underline">
    View Profile
</button>
```
To:
```javascript
<button 
    onClick={() => handleViewProfile(emp)}
    className="text-primary font-medium text-xs hover:underline"
>
    View Profile
</button>
```

### Step 6: Update Quick Actions "Add Employee" (Line 224)
Find the Quick Actions "Add Employee" button around line 224, change from:
```javascript
<button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left">
```
To:
```javascript
<button onClick={() => setShowAddEmployeeModal(true)} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left">
```

### Step 7: Add Modals Before Final Closing Tags (Before line 1011)
Before the final `</div>` closing tags (around line 1000-1011), add:
```javascript
{/* Add Employee Modal */}
<AddEmployeeModal
    show={showAddEmployeeModal}
    onClose={() => setShowAddEmployeeModal(false)}
    employees={employees}
    departments={departments}
    onAdd={handleAddEmployee}
/>

{/* Employee Profile Modal */}
<EmployeeProfileModal
    show={showEmployeeProfileModal}
    employee={selectedEmployee}
    onClose={() => {
        setShowEmployeeProfileModal(false);
        setSelectedEmployee(null);
    }}
    onUpdate={handleUpdateEmployee}
    onDelete={handleDeleteEmployee}
    departments={departments}
/>
```

## 🎯 Testing

After integration:
1. Go to http://localhost:5173
2. Navigate to HR module
3. Click "Add Employee" → Modal should open
4. Verify auto-generated ID displays correctly
5. Fill form and save
6. Click "View Profile" on an employee
7. Edit employee details
8. Test delete functionality

## 🚀 What You'll Get

### Add Employee Modal
- Auto-generated employee ID with prefix (EMP-, CNT-, INT-, TMP-)
- Full form validation
- Department selection
- Saves to DataContext

### Employee Profile Modal
- View all employee details
- Edit mode with inline forms
- Update employee information
- Delete with confirmation
- Leave balance display

---

**Note**: If you encounter any errors after integration, check:
1. Import paths are correct
2. All brackets/braces are balanced
3. No duplicate function names
4. Dev server is running
