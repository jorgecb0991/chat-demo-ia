"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Globe,
    Type,
    Lightbulb,
    FileText,
    UploadCloud,
    FileCheck,
    RefreshCw,
} from "lucide-react";

interface Props {
    sourceType: string;
    onTypeChange: (type: string) => void;
    sourceValue: string;
    onValueChange: (value: string) => void;
    onFileChange?: (bytes: Uint8Array, mimeType: string) => void;
}

export default function SourceMaterialInput({
    sourceType,
    onTypeChange,
    sourceValue,
    onValueChange,
    onFileChange,
}: Props) {
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

    return (
        <div className="flex flex-col w-full">
            <label className="font-medium mb-2">Material de origen</label>

            <Tabs value={sourceType} onValueChange={onTypeChange} className="w-full gap-0">
                {/*TabsList con scroll horizontal en móviles */}
                <TabsList className="flex w-full overflow-x-auto rounded-md no-scrollbar pb-1">
                    <TabsTrigger value="topic" className="flex items-center whitespace-nowrap">
                        <Lightbulb size={16} />
                        Topic
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex items-center  whitespace-nowrap">
                        <Type size={16} />
                        Text
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center whitespace-nowrap">
                        <Globe size={16} />
                        Url
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center whitespace-nowrap">
                        <FileText size={16} />
                        File
                    </TabsTrigger>
                </TabsList>

                {/* ✅ Separación para que no se solape con textarea */}
                <div className="mt-3">
                    <TabsContent value="topic">
                        <textarea
                            placeholder="Ej. Energía Cinética"
                            className="w-full min-h-[100px] max-h-[300px] resize-y p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            value={sourceValue}
                            onChange={(e) => onValueChange(e.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="text">
                        <textarea
                            placeholder="Pega un texto..."
                            className="w-full min-h-[100px] max-h-[300px] resize-y p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            value={sourceValue}
                            onChange={(e) => onValueChange(e.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="url">
                        <textarea
                            placeholder="URL de página o video de YouTube"
                            className="w-full min-h-[100px] max-h-[300px] resize-y p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            value={sourceValue}
                            onChange={(e) => onValueChange(e.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="file">
                        {!uploadedFile ? (
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <UploadCloud className="w-10 h-10 mb-2 text-muted-foreground sm:w-12 sm:h-12 sm:mb-3" />
                                <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 w-full p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                                    <span className="font-medium text-sm sm:text-base">{uploadedFile.name}</span>
                                </div>
                                <button
                                    className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm border rounded text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                    onClick={() => setUploadedFile(null)}
                                >
                                    <RefreshCw size={12} />
                                    Reemplazar
                                </button>
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>

        </div>
    );
}
