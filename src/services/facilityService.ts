"use server";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { FacilityConfig, UnitStatistics, LayoutName } from '@/types/patient';
import { getPatients } from './patientService';

const facilityConfigDocRef = doc(db, 'appState', 'facilityConfig');

export async function getFacilityConfig(): Promise<FacilityConfig> {
    try {
        const docSnap = await getDoc(facilityConfigDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as FacilityConfig;
        }
        // Default facility name
        const defaultConfig: FacilityConfig = { 
            facilityName: 'Victoria Hospital' 
        };
        await setDoc(facilityConfigDocRef, defaultConfig);
        return defaultConfig;
    } catch (error) {
        console.error("Error fetching facility config from Firestore:", error);
        return { facilityName: 'Victoria Hospital' };
    }
}

export async function setFacilityName(facilityName: string): Promise<void> {
    try {
        await setDoc(facilityConfigDocRef, { facilityName }, { merge: true });
    } catch (error) {
        console.error("Error setting facility name:", error);
    }
}

export async function getUnitStatistics(layoutName: LayoutName): Promise<UnitStatistics> {
    const patients = await getPatients(layoutName);
    
    const totalRooms = patients.length;
    const beddedPatients = patients.filter(p => p.name !== 'Vacant').length;
    
    // A room is available if it's vacant, clean (or undefined which defaults to clean), and not blocked
    const availableRooms = patients.filter(p => 
        p.name === 'Vacant' && 
        (!p.roomStatus || p.roomStatus === 'clean') && 
        !p.isBlocked
    ).length;
    
    const dirtyRooms = patients.filter(p => p.roomStatus === 'dirty').length;
    const blockedRooms = patients.filter(p => p.isBlocked).length;
    const pendingTransfersIn = patients.filter(p => p.transferStatus === 'pending_in').length;
    const pendingTransfersOut = patients.filter(p => p.transferStatus === 'pending_out').length;

    return {
        unitName: layoutName,
        beddedPatients,
        availableRooms,
        dirtyRooms,
        blockedRooms,
        pendingTransfersIn,
        pendingTransfersOut,
        totalRooms
    };
}

export async function getAllUnitsStatistics(layoutNames: LayoutName[]): Promise<UnitStatistics[]> {
    const statistics = await Promise.all(
        layoutNames.map(layoutName => getUnitStatistics(layoutName))
    );
    return statistics;
}
