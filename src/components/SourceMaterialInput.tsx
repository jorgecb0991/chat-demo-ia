"use client";

import * as React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Globe, Type, Lightbulb, FileText, UploadCloud, FileCheck, RefreshCw } from "lucide-react";

interface Props {
    sourceType: string;
    onTypeChange: (type: string) => void;
    sourceValue: string;
    onValueChange: (value: string) => void;
    onFileChange?: (bytes: Uint8Array, mimeType: string) => void;
}

export default function SourceMaterialInput({ sourceType, onTypeChange, sourceValue, onValueChange, onFileChange }: Props) {
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    return (
        <div className="flex flex-col w-full">
            <label className="font-medium mb-1">Material de origen</label>

            <Tabs.Root value={sourceType} onValueChange={onTypeChange} className="w-full">
                <Tabs.List className="inline-flex w-full rounded-t-xl border bg-secondary p-1">
                    <TabTrigger value="topic" icon={<Lightbulb size={18} />} label="Topic" />
                    <TabTrigger value="text" icon={<Type size={18} />} label="Text" />
                    <TabTrigger value="url" icon={<Globe size={18} />} label="Url" />
                    <TabTrigger value="file" icon={<FileText size={18} />} label="File" />
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
                        placeholder="URL de página o video de youtube"
                        className="w-full p-2 border rounded mt-1"
                        value={sourceValue}
                        onChange={(e) => onValueChange(e.target.value)}
                    />
                </Tabs.Content>

                <Tabs.Content value="file">
                    {!uploadedFile ? (
                        <label
                            htmlFor="file-upload"
                            className="
                                flex flex-col items-center justify-center w-full h-48 
                                border-2 border-dashed border-gray-400 rounded-lg 
                                cursor-pointer bg-secondary text-gray-800 
                                hover:bg-secondary/80 transition-colors duration-200
                            "
                        >
                            <UploadCloud className="w-12 h-12 mb-4 text-gray-200" />
                            <span className="text-lg text-white text-center 
                                bg-black/30 px-3 py-1 rounded drop-shadow">
                                Haz click o arrastra un archivo aquí
                            </span>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setUploadedFile(file);
                                        const arrayBuffer = await file.arrayBuffer();
                                        const bytes = new Uint8Array(arrayBuffer);
                                        onFileChange?.(bytes, file.type);
                                    }
                                }}
                            />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between w-full p-4 border rounded-lg bg-green-50">
                            <div className="flex items-center gap-3">
                                <FileCheck className="w-6 h-6 text-green-600" />
                                <span className="font-medium text-gray-800">{uploadedFile.name}</span>
                            </div>
                            <button
                                className="flex items-center gap-1 px-2 py-1 text-sm border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
                                onClick={() => setUploadedFile(null)}
                            >
                                <RefreshCw size={14} />
                                Reemplazar
                            </button>
                        </div>
                    )}
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