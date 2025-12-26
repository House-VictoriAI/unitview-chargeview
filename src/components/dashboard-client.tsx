"use client";

import React from 'react';
import Link from 'next/link';
import { Building2, Users, DoorOpen, Ban, Droplet, ArrowDownToLine, ArrowUpFromLine, LayoutGrid, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { UnitStatistics } from '@/types/patient';

interface DashboardClientProps {
    facilityName: string;
    unitsStatistics: UnitStatistics[];
}

interface StatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: number;
    className?: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold">{value}</span>
        </div>
    </div>
);

export default function DashboardClient({ facilityName, unitsStatistics }: DashboardClientProps) {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Building2 className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-4xl font-bold">{facilityName}</h1>
                        <p className="text-muted-foreground">Unit Overview Dashboard</p>
                    </div>
                </div>

                {/* Units List */}
                <div className="space-y-4">
                    {unitsStatistics.map((unit) => (
                        <Card key={unit.unitName} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl">{unit.unitName}</CardTitle>
                                    <div className="flex gap-2">
                                        <Link href={`/unit/${encodeURIComponent(unit.unitName)}`}>
                                            <Button variant="default" size="sm">
                                                <LayoutGrid className="h-4 w-4 mr-2" />
                                                Enter Unit
                                            </Button>
                                        </Link>
                                        <Link href={`/assignments/${encodeURIComponent(unit.unitName)}`}>
                                            <Button variant="outline" size="sm">
                                                <ClipboardList className="h-4 w-4 mr-2" />
                                                Assignments
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <StatBadge 
                                        icon={Users} 
                                        label="Bedded Patients" 
                                        value={unit.beddedPatients}
                                    />
                                    <StatBadge 
                                        icon={DoorOpen} 
                                        label="Available Rooms" 
                                        value={unit.availableRooms}
                                        className="text-green-600"
                                    />
                                    <StatBadge 
                                        icon={Droplet} 
                                        label="Dirty Rooms" 
                                        value={unit.dirtyRooms}
                                        className="text-yellow-600"
                                    />
                                    <StatBadge 
                                        icon={Ban} 
                                        label="Blocked Rooms" 
                                        value={unit.blockedRooms}
                                        className="text-red-600"
                                    />
                                    <StatBadge 
                                        icon={ArrowDownToLine} 
                                        label="Pending Transfers In" 
                                        value={unit.pendingTransfersIn}
                                        className="text-blue-600"
                                    />
                                    <StatBadge 
                                        icon={ArrowUpFromLine} 
                                        label="Pending Transfers Out" 
                                        value={unit.pendingTransfersOut}
                                        className="text-purple-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {unitsStatistics.length === 0 && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No units configured yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
