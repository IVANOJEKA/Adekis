// This file contains the API-backed functions for Blood Bank, Ambulance, and HR modules
// Add these to DataContext.jsx exports

import { bloodBankAPI, ambulanceAPI, hrAPI } from '../services/api';

// ==================== BLOOD BANK FUNCTIONS ====================

export const useBloodBank = () => {
    const [bloodInventory, setBloodInventory] = useState([]);
    const [bloodDonors, setBloodDonors] = useState([]);
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBloodBankData();
    }, []);

    const fetchBloodBankData = async () => {
        try {
            setLoading(true);
            const [inventory, donors, requests] = await Promise.all([
                bloodBankAPI.getInventory(),
                bloodBankAPI.getDonors(),
                bloodBankAPI.getRequests()
            ]);
            setBloodInventory(inventory);
            setBloodDonors(donors);
            setBloodRequests(requests);
        } catch (error) {
            console.error('Error fetching blood bank data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addDonor = async (donorData) => {
        try {
            const donor = await bloodBankAPI.addDonor(donorData);
            setBloodDonors(prev => [donor, ...prev]);
            return donor;
        } catch (error) {
            console.error('Error adding donor:', error);
            throw error;
        }
    };

    const recordDonation = async (donorId) => {
        try {
            const donor = await bloodBankAPI.recordDonation(donorId);
            setBloodDonors(prev => prev.map(d => d.id === donorId ? donor : d));
            await fetchBloodBankData(); // Refresh to get updated inventory
            return donor;
        } catch (error) {
            console.error('Error recording donation:', error);
            throw error;
        }
    };

    const createBloodRequest = async (requestData) => {
        try {
            const request = await bloodBankAPI.createRequest(requestData);
            setBloodRequests(prev => [request, ...prev]);
            return request;
        } catch (error) {
            console.error('Error creating blood request:', error);
            throw error;
        }
    };

    const approveBloodRequest = async (requestId) => {
        try {
            const request = await bloodBankAPI.approveRequest(requestId);
            setBloodRequests(prev => prev.map(r => r.id === requestId ? request : r));
            await fetchBloodBankData(); // Refresh to get updated inventory
            return request;
        } catch (error) {
            console.error('Error approving request:', error);
            throw error;
        }
    };

    const rejectBloodRequest = async (requestId) => {
        try {
            const request = await bloodBankAPI.rejectRequest(requestId);
            setBloodRequests(prev => prev.map(r => r.id === requestId ? request : r));
            return request;
        } catch (error) {
            console.error('Error rejecting request:', error);
            throw error;
        }
    };

    const updateInventory = async (id, data) => {
        try {
            const updated = await bloodBankAPI.updateInventory(id, data);
            setBloodInventory(prev => prev.map(i => i.id === id ? updated : i));
            return updated;
        } catch (error) {
            console.error('Error updating inventory:', error);
            throw error;
        }
    };

    return {
        bloodInventory, setBloodInventory,
        bloodDonors, setBloodDonors,
        bloodRequests, setBloodRequests,
        addDonor,
        recordDonation,
        createBloodRequest,
        approveBloodRequest,
        rejectBloodRequest,
        updateInventory,
        refreshBloodBank: fetchBloodBankData,
        loading
    };
};

// ==================== AMBULANCE FUNCTIONS ====================

export const use Ambulance = () => {
    const [ambulanceFleet, setAmbulanceFleet] = useState([]);
    const [dispatchRequests, setDispatchRequests] = useState([]);
    const [ambulanceTrips, setAmbulanceTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAmbulanceData();
    }, []);

    const fetchAmbulanceData = async () => {
        try {
            setLoading(true);
            const [fleet, requests, trips] = await Promise.all([
                ambulanceAPI.getFleet(),
                ambulanceAPI.getRequests(),
                ambulanceAPI.getTrips()
            ]);
            setAmbulanceFleet(fleet);
            setDispatchRequests(requests);
            setAmbulanceTrips(trips);
        } catch (error) {
            console.error('Error fetching ambulance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addAmbulance = async (ambulanceData) => {
        try {
            const ambulance = await ambulanceAPI.addAmbulance(ambulanceData);
            setAmbulanceFleet(prev => [ambulance, ...prev]);
            return ambulance;
        } catch (error) {
            console.error('Error adding ambulance:', error);
            throw error;
        }
    };

    const updateAmbulance = async (id, data) => {
        try {
            const ambulance = await ambulanceAPI.updateAmbulance(id, data);
            setAmbulanceFleet(prev => prev.map(a => a.id === id ? ambulance : a));
            return ambulance;
        } catch (error) {
            console.error('Error updating ambulance:', error);
            throw error;
        }
    };

    const createDispatchRequest = async (requestData) => {
        try {
            const request = await ambulanceAPI.createRequest(requestData);
            setDispatchRequests(prev => [request, ...prev]);
            return request;
        } catch (error) {
            console.error('Error creating dispatch request:', error);
            throw error;
        }
    };

    const dispatchAmbulance = async (requestId, ambulanceId) => {
        try {
            const { request, trip } = await ambulanceAPI.dispatchAmbulance(requestId, ambulanceId);
            setDispatchRequests(prev => prev.map(r => r.id === requestId ? request : r));
            setAmbulanceTrips(prev => [trip, ...prev]);
            await fetchAmbulanceData(); // Refresh to get updated ambulance status
            return { request, trip };
        } catch (error) {
            console.error('Error dispatching ambulance:', error);
            throw error;
        }
    };

    const completeTrip = async (tripId, data) => {
        try {
            const trip = await ambulanceAPI.completeTrip(tripId, data);
            setAmbulanceTrips(prev => prev.map(t => t.id === tripId ? trip : t));
            await fetchAmbulanceData(); // Refresh to get updated ambulance status
            return trip;
        } catch (error) {
            console.error('Error completing trip:', error);
            throw error;
        }
    };

    return {
        ambulanceFleet, setAmbulanceFleet,
        dispatchRequests, setDispatchRequests,
        ambulanceTrips, setAmbulanceTrips,
        addAmbulance,
        updateAmbulance,
        createDispatchRequest,
        dispatchAmbulance,
        completeTrip,
        refreshAmbulance: fetchAmbulanceData,
        loading
    };
};

// ==================== HR FUNCTIONS ====================

export const useHR = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHRData();
    }, []);

    const fetchHRData = async () => {
        try {
            setLoading(true);
            const [emps, att, leaves, pay] = await Promise.all([
                hrAPI.getEmployees(),
                hrAPI.getAttendance(),
                hrAPI.getLeaveRequests(),
                hrAPI.getPayroll()
            ]);
            setEmployees(emps);
            setAttendance(att);
            setLeaveRequests(leaves);
            setPayroll(pay);
        } catch (error) {
            console.error('Error fetching HR data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (employeeData) => {
        try {
            const employee = await hrAPI.addEmployee(employeeData);
            setEmployees(prev => [employee, ...prev]);
            return employee;
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error;
        }
    };

    const updateEmployee = async (id, data) => {
        try {
            const employee = await hrAPI.updateEmployee(id, data);
            setEmployees(prev => prev.map(e => e.id === id ? employee : e));
            return employee;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    };

    const markAttendance = async (attendanceData) => {
        try {
            const record = await hrAPI.markAttendance(attendanceData);
            setAttendance(prev => [record, ...prev]);
            return record;
        } catch (error) {
            console.error('Error marking attendance:', error);
            throw error;
        }
    };

    const createLeaveRequest = async (leaveData) => {
        try {
            const leave = await hrAPI.createLeaveRequest(leaveData);
            setLeaveRequests(prev => [leave, ...prev]);
            return leave;
        } catch (error) {
            console.error('Error creating leave request:', error);
            throw error;
        }
    };

    const updateLeaveRequest = async (id, data) => {
        try {
            const leave = await hrAPI.updateLeaveRequest(id, data);
            setLeaveRequests(prev => prev.map(l => l.id === id ? leave : l));
            return leave;
        } catch (error) {
            console.error('Error updating leave request:', error);
            throw error;
        }
    };

    const createPayroll = async (payrollData) => {
        try {
            const payrollRecord = await hrAPI.createPayroll(payrollData);
            setPayroll(prev => [payrollRecord, ...prev]);
            return payrollRecord;
        } catch (error) {
            console.error('Error creating payroll:', error);
            throw error;
        }
    };

    const updatePayroll = async (id, data) => {
        try {
            const payrollRecord = await hrAPI.updatePayroll(id, data);
            setPayroll(prev => prev.map(p => p.id === id ? payrollRecord : p));
            return payrollRecord;
        } catch (error) {
            console.error('Error updating payroll:', error);
            throw error;
        }
    };

    return {
        employees, setEmployees,
        attendance, setAttendance,
        leaveRequests, setLeaveRequests,
        payroll, setPayroll,
        addEmployee,
        updateEmployee,
        markAttendance,
        createLeaveRequest,
        updateLeaveRequest,
        createPayroll,
        updatePayroll,
        refreshHR: fetchHRData,
        loading
    };
};
