import { db } from '../services/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import {
    initialPatientData,
    initialUserData,
    initialServicesData,
    initialAppointmentsData
    // Add others as needed
} from '../services/seedData';

// Helper to batch upload
const uploadCollection = async (collectionName, data) => {
    let count = 0;
    for (const item of data) {
        try {
            // Use item.id as doc ID if available, otherwise auto-ID
            if (item.id) {
                await setDoc(doc(db, collectionName, String(item.id)), item);
            } else {
                await setDoc(doc(collection(db, collectionName)), item);
            }
            count++;
        } catch (error) {
            console.error(`Error migrating ${collectionName} item ${item.id}:`, error);
        }
    }
    console.log(`Migrated ${count} items to ${collectionName}`);
    return count;
};

export const migrateAllData = async () => {
    try {
        console.log("Starting Migration...");

        await uploadCollection('patients', initialPatientData);
        await uploadCollection('users', initialUserData); // Legacy profiles
        await uploadCollection('services', initialServicesData);
        await uploadCollection('appointments', initialAppointmentsData);

        // Add more collections here

        console.log("Migration Complete!");
        return { success: true, message: "Migration completed successfully" };
    } catch (error) {
        console.error("Migration Failed:", error);
        return { success: false, error: error.message };
    }
};
