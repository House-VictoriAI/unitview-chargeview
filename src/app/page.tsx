import React from 'react';
import DashboardClient from '@/components/dashboard-client';
import * as layoutService from '@/services/layoutService';
import * as facilityService from '@/services/facilityService';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch facility configuration and all layouts
  const [facilityConfig, allLayouts] = await Promise.all([
    facilityService.getFacilityConfig(),
    layoutService.getAvailableLayouts(),
  ]);

  // Fetch statistics for all units
  const unitsStatistics = await facilityService.getAllUnitsStatistics(allLayouts);

  return (
    <DashboardClient 
      facilityName={facilityConfig.facilityName}
      unitsStatistics={unitsStatistics}
    />
  );
}
