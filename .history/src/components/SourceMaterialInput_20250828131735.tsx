"use client";

import * as React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Globe, Type, Lightbulb, FileText } from "lucide-react";

interface Props {
    sourceType: string;
    onTypeChange: (type: string) => void;
    sourceValue: string;
    onValueChange: (value: string) => void;
}

export default function SourceMaterialInput({ sourceType, onTypeChange, sourceValue, onValueChange }: Props) {
    return (
        <div className="flex flex-col w-full">
            <label className="font-medium mb-1">Material de origen</label>

            <Tabs.Root value={sourceType} onValueChange={onTypeChange} className="w-full">
                <Tabs.List className="inline-flex w-full rounded-t-xl border bg-secondary p-1">
                    <TabTrigger value="topic" icon={<Lightbulb size={18} />} label="Topic" />
                    <TabTrigger value="text" icon={<Type size={18} />} label="Text" />
                    <TabTrigger value="url" icon={<Globe size={18} />} label="Url" />
                    <TabTrigger value="file" icon={<FileText size={18} />} label="File" />*/}
                </Tabs.List>

                <Tabs.Content value="topic">
                    <textarea
                        placeholder="Ej. Energía Cinética"
                        className="w-full p-2 border rounded mt-1"
                        value={sourceValue}
                        onChange={(e) => onValueChange(e.target.value)}
                    />
                </Tabs.Content>

                <Tabs.Content value="text">
                    <textarea
                        placeholder="Pega un texto..."
                        className="w-full p-2 border rounded mt-1"
                        value={sourceValue}
                        onChange={(e) => onValueChange(e.target.value)}
                    />
                </Tabs.Content>

                <Tabs.Content value="url">
                    <textarea
                        placeholder="URL de página o video"
                        className="w-full p-2 border rounded mt-1"
                        value={sourceValue}
                        onChange={(e) => onValueChange(e.target.value)}
                    />
                </Tabs.Content>

                <Tabs.Content value="file">
                    <input type="file" className="block w-full p-2 border rounded mt-1" />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

interface TabTriggerProps {
    value: string;
    icon: React.ReactNode;
    label: string;
}

function TabTrigger({ value, icon, label }: TabTriggerProps) {
    return (
        <Tabs.Trigger
            value={value}
            className="
                flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 
                border-transparent data-[state=active]:border-blue-500 
                data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-600
            "
        >
            {icon}
            {label}
        </Tabs.Trigger>
    );
}