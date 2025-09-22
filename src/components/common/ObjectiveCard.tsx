"use client";

import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import React from 'react';

type ObjectiveCardProps = {
    intention: string; // o el tipo correcto que esperas
};

export default function ObjectiveCard({ intention }: ObjectiveCardProps) {
    return (
        <Card className="p-6 shadow-sm gap-2 bg-gradient-to-r from-[#00A3D7]/5 via-white to-white border-l-4 border-[#00A3D7]">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-900 mb-3">
                <Target className="w-5 h-5 text-blue-700" />
                Objetivo
            </h2>
            <p className="whitespace-pre-line text-gray-800">{intention}</p>
        </Card>
    );
}
