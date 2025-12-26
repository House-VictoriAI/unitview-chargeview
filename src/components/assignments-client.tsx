"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LayoutName, Patient } from '@/types/patient';
import type { Nurse, PatientCareTech } from '@/types/nurse';

interface AssignmentsClientProps {
    layoutName: LayoutName;
    patients: Patient[];
    nurses: Nurse[];
    techs: PatientCareTech[];
}

export default function AssignmentsClient({ 
    layoutName, 
    patients, 
    nurses, 
    techs 
}: AssignmentsClientProps) {
    const activePatients = patients.filter(p => p.name !== 'Vacant');
    const staffNurses = nurses.filter(n => n.role === 'Staff Nurse' || n.role === 'Float Pool Nurse');

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="h-10 w-10 text-primary" />
                        <div>
                            <h1 className="text-4xl font-bold">Assignments - {layoutName}</h1>
                            <p className="text-muted-foreground">Patient-Nurse Assignments</p>
                        </div>
                    </div>
                    <Link href={`/unit/${encodeURIComponent(layoutName)}`}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Unit
                        </Button>
                    </Link>
                </div>

                {/* Nurse Assignments */}
                <div className="space-y-4">
                    {staffNurses.map((nurse) => {
                        const assignedPatients = activePatients.filter(p => 
                            nurse.assignedPatientIds.includes(p.id)
                        );

                        return (
                            <Card key={nurse.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{nurse.name}</span>
                                        <span className="text-sm text-muted-foreground font-normal">
                                            {nurse.role} • {assignedPatients.length} patient(s)
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {assignedPatients.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {assignedPatients.map((patient) => (
                                                <div 
                                                    key={patient.id}
                                                    className="p-3 border rounded-lg bg-secondary/50"
                                                >
                                                    <div className="font-semibold">{patient.roomDesignation}</div>
                                                    <div className="text-sm">{patient.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {patient.chiefComplaint}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            No patients assigned
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {staffNurses.length === 0 && (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No staff nurses assigned to this unit.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Patient Care Techs */}
                {techs.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Patient Care Techs</h2>
                        <div className="space-y-4">
                            {techs.map((tech) => {
                                return (
                                    <Card key={tech.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{tech.name}</span>
                                                <span className="text-sm text-muted-foreground font-normal">
                                                    Patient Care Tech • {tech.assignmentGroup}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Assignment Group: {tech.assignmentGroup}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Spectra: {tech.spectra}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
