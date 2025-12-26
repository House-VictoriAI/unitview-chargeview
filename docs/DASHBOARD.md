# Main Dashboard Feature

## Overview

A new main dashboard has been implemented that provides a facility-level overview of all hospital units. This dashboard displays the facility name and lists all configured units with their real-time statistics.

## Features

### Dashboard View (Root `/`)

The main dashboard displays:

1. **Facility Name**: Configurable facility name (defaults to "Victoria Hospital")
2. **Unit Cards**: Each unit shows:
   - Unit name
   - Bedded Patients count
   - Available Rooms count (clean, vacant, not blocked)
   - Dirty Rooms count
   - Blocked Rooms count
   - Pending Transfers In count
   - Pending Transfers Out count
   - "Enter Unit" button - navigates to the unit's map display mode
   - "Assignments" button - navigates to the unit's assignments page

### Unit View (`/unit/[layoutName]`)

The existing unit map view has been moved to this route. It displays the interactive grid layout for a specific unit where charge nurses can:
- View and manage patient rooms
- Assign nurses to patients
- Drag and drop patients between rooms
- View patient details and alerts

### Assignments View (`/assignments/[layoutName]`)

A new assignments page shows:
- List of all staff nurses and their assigned patients
- Patient Care Techs and their assignments
- Patient room numbers and names
- Chief complaints for each patient
- Back to Unit button to return to the map view

## Data Model Changes

### New Types (src/types/patient.ts)

```typescript
// New room and transfer status types
export type RoomStatus = 'clean' | 'dirty';
export type TransferStatus = 'none' | 'pending_in' | 'pending_out';

// Extended Patient interface
export interface Patient {
  // ... existing fields ...
  roomStatus?: RoomStatus; // clean or dirty
  transferStatus?: TransferStatus; // none, pending_in, or pending_out
}

// New interfaces for dashboard
export interface UnitStatistics {
    unitName: LayoutName;
    beddedPatients: number;
    availableRooms: number;
    dirtyRooms: number;
    blockedRooms: number;
    pendingTransfersIn: number;
    pendingTransfersOut: number;
    totalRooms: number;
}

export interface FacilityConfig {
    facilityName: string;
}
```

## New Services

### Facility Service (src/services/facilityService.ts)

Provides functions for:
- `getFacilityConfig()`: Get facility configuration (name)
- `setFacilityName(name)`: Set facility name
- `getUnitStatistics(layoutName)`: Calculate statistics for a single unit
- `getAllUnitsStatistics(layoutNames)`: Get statistics for all units

The statistics are calculated from patient data:
- **Bedded Patients**: Patients where name ≠ 'Vacant'
- **Available Rooms**: Vacant, clean, not blocked rooms
- **Dirty Rooms**: Rooms with roomStatus = 'dirty'
- **Blocked Rooms**: Rooms with isBlocked = true
- **Pending Transfers In**: Rooms with transferStatus = 'pending_in'
- **Pending Transfers Out**: Rooms with transferStatus = 'pending_out'

## New Components

1. **DashboardClient** (`src/components/dashboard-client.tsx`): Main dashboard UI
2. **AssignmentsClient** (`src/components/assignments-client.tsx`): Assignments page UI

## Routing Structure

```
/                                    → Main Dashboard (facility overview)
/unit/[layoutName]                   → Unit Map View (existing functionality)
/assignments/[layoutName]            → Assignments View (new)
```

## Usage

### For End Users

1. Start at the dashboard to see an overview of all units
2. Click "Enter Unit" to access the interactive map for that unit
3. Click "Assignments" to view current patient-nurse assignments
4. Navigate back to dashboard using browser back button or create a header link

### For Developers

To add room status tracking to existing patient admission/discharge flows:

```typescript
// When admitting a patient, mark room as clean
const patient: Patient = {
  // ... other fields ...
  roomStatus: 'clean',
  transferStatus: 'none'
};

// When patient is discharged, mark room as dirty
const updatedPatient = {
  ...patient,
  name: 'Vacant',
  roomStatus: 'dirty'
};

// When scheduling a transfer in
const transferInPatient = {
  ...patient,
  transferStatus: 'pending_in'
};

// When scheduling a transfer out
const transferOutPatient = {
  ...patient,
  transferStatus: 'pending_out'
};
```

## Configuration

The facility name can be configured in Firestore:
- Collection: `appState`
- Document: `facilityConfig`
- Field: `facilityName`

Default facility name is "Victoria Hospital".

## Future Enhancements

Possible improvements:
1. Add ability to edit facility name from UI
2. Add filters to dashboard (e.g., show only units with pending transfers)
3. Add real-time updates using Firestore listeners
4. Add historical statistics and trends
5. Add buttons to mark rooms as dirty/clean from the unit view
6. Add transfer management UI to create pending transfers
7. Export dashboard statistics to CSV/PDF
