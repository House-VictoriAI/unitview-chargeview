import React from 'react';
import AssignmentsClient from '@/components/assignments-client';
import type { LayoutName } from '@/types/patient';
import * as layoutService from '@/services/layoutService';
import * as patientService from '@/services/patientService';
import * as nurseService from '@/services/nurseService';

export const dynamic = 'force-dynamic';

interface AssignmentsPageProps {
  params: Promise<{
    layoutName: string;
  }>;
}

export default async function AssignmentsPage({ params }: AssignmentsPageProps) {
  const { layoutName } = await params;
  const layoutToLoad: LayoutName = decodeURIComponent(layoutName);
  
  // Verify the layout exists
  const allLayouts = await layoutService.getAvailableLayouts();
  if (!allLayouts.includes(layoutToLoad)) {
    throw new Error(`Layout "${layoutToLoad}" not found`);
  }
      
  // Fetch data for the layout
  const [patients, nurses, techs] = await Promise.all([
    patientService.getPatients(layoutToLoad),
    nurseService.getNurses(layoutToLoad),
    nurseService.getTechs(layoutToLoad),
  ]);

  return (
    <AssignmentsClient 
      layoutName={layoutToLoad}
      patients={patients}
      nurses={nurses}
      techs={techs}
    />
  );
}
