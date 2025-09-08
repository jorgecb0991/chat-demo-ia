"use client";

import React from 'react';
import { useState, useEffect } from "react";
import Image from "next/image";
import { Presentation } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

import SourceMaterialInput from "@/components/ui/source-material-input";
import DefaultLayout from "@/components/layout/DefaultLayout";

interface Slide {
    titulo: string;
    contenido: string[];
    imagen_local?: string;
}

interface EstructuraSlide {
    titulo: string;
    slides: Slide[];
}

interface Plantilla {
    nombre: string;
    preview: string;
    archivo: string;
}

export default function SlideGeneratorPage() {
    const [sourceType, setSourceType] = useState("topic");
    const [sourceValue, setSourceValue] = useState("");
    const [titulo, setTitulo] = useState("");
    const [numSlides, setNumSlides] = useState(5);
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [loadingPlantillas, setLoadingPlantillas] = useState(true);
    const [instruccionesProfesor, setInstruccionesProfesor] = useState("");
    const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const isYoutube = sourceType !== "file" && detectarYouTube(sourceValue);

    useEffect(() => {
        const cargarPlantillas = async () => {
            try {
                const response = await fetch("/api/ppt/get-api-plantillas");
                const data = await response.json();
                setPlantillas(data);
                if (data.length > 0) {
                    setPlantillaSeleccionada(data[0].nombre);
                }
            } catch (error) {
                console.error("Error cargando plantillas:", error);
                toast.error("No se pudieron cargar las plantillas.");
            } finally {
                setLoadingPlantillas(false);
            }
        };
        cargarPlantillas();
    }, []);

    const generarSlides = async () => {
        if (sourceType !== "file" && (!sourceValue.trim() || !titulo.trim())) {
            toast.warning("Completa todos los campos antes de continuar.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", titulo);
            formData.append("slide_count", numSlides.toString());
            formData.append("template", plantillaSeleccionada);
            formData.append("sourceValue", sourceValue);

            if (instruccionesProfesor.trim()) {
                formData.append("instruction_teacher", instruccionesProfesor.trim());
            }

            let typeToSend = sourceType;
            if (sourceType !== "file" && sourceValue.startsWith("http")) {
                typeToSend = detectarYouTube(sourceValue) ? "youtube" : "webpage";
            }
            formData.append("sourceType", typeToSend);

            if (sourceType === "file") {
                if (!fileBytes || !mimeType) {
                    setLoading(false);
                    toast.error("Debes subir un archivo para continuar.");
                    return;
                }
                formData.append(
                    "file",
                    new Blob([fileBytes], { type: mimeType }),
                    "archivo"
                );
            }

            const response = await fetch("/api/ppt/generate-ppt", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Error: ${response.status} ${response.statusText}. ${errorText}`
                );
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = titulo + ".pptx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success("La presentación se generó correctamente.");
        } catch (error) {
            console.error("Error al generar slides:", error);
            toast.error(
                "Ocurrió un error al generar la presentación. " +
                (error as Error).message
            );
        } finally {
            setLoading(false);
        }
    };

    function detectarYouTube(url: string): boolean {
        if (!url) return false;
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.toLowerCase();
            return hostname.includes("youtube.com") || hostname.includes("youtu.be");
        } catch {
            return false;
        }
    }

    return (
        <DefaultLayout
            title="Generador de Presentaciones"
            titleIcon={<Presentation className="w-6 h-6" />}
            description="Completa la información para generar tu presentación."
            loading={loading}
            loadingMessage={
                isYoutube
                    ? "Procesando video de YouTube... Esto puede tardar un poco más"
                    : "Generando presentación..."
            }
            loadingIcon={
                isYoutube ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-20 h-20 animate-pulse">
                            <Image
                                src="/img/logo_utec_youtube.png"
                                alt="YouTube"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-white text-lg font-semibold text-center">
                            Procesando video de YouTube... Esto puede tardar un poco más
                        </p>
                    </div>
                ) : undefined
            }
        >
            
                <div className="space-y-6">
                    <SourceMaterialInput
                        sourceType={sourceType}
                        onTypeChange={setSourceType}
                        sourceValue={sourceValue}
                        onValueChange={(value) => setSourceValue(value)}
                        onFileChange={(bytes, type) => {
                            setFileBytes(bytes);
                            setMimeType(type);
                        }}
                    />

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="titulo">Título de la presentación</Label>
                        <Input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej. Conceptos clave sobre energía en física"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="numSlides">Número de slides sugerido</Label>
                        <Input
                            id="numSlides"
                            type="number"
                            value={numSlides}
                            onChange={(e) => setNumSlides(Number(e.target.value))}
                            min={1}
                            max={20}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="instruccionesProfesor">
                            Instrucciones adicionales del profesor (opcional)
                        </Label>
                        <Textarea
                            id="instruccionesProfesor"
                            rows={4}
                            value={instruccionesProfesor}
                            onChange={(e) => setInstruccionesProfesor(e.target.value)}
                            placeholder="Ej. Enfocar la presentación en aplicaciones en ingeniería civil"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>Seleccionar Plantilla</Label>
                        {loadingPlantillas ? (
                            <p className="text-sm text-muted-foreground">Cargando plantillas...</p>
                        ) : (
                            <div className="mt-2">
                                <Select
                                    value={plantillaSeleccionada}
                                    onValueChange={setPlantillaSeleccionada}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una plantilla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plantillas.length > 0 ? (
                                            plantillas.map((plantilla) => (
                                                <SelectItem key={plantilla.nombre} value={plantilla.nombre}>
                                                    {plantilla.nombre}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>
                                                No hay plantillas disponibles
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>

                                {plantillaSeleccionada && (
                                    <Card className="mt-4 gap-2">
                                        <CardHeader>
                                            <CardTitle>Vista previa</CardTitle>
                                            <CardDescription>
                                                Plantilla seleccionada: {plantillaSeleccionada}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="relative w-full aspect-video     rounded">
                                                <Image
                                                    src={plantillas.find((p) => p.nombre === plantillaSeleccionada)?.preview || ""}
                                                    alt={`Preview ${plantillaSeleccionada}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>

                    <Button onClick={generarSlides} disabled={loading || loadingPlantillas}>
                        {loading ? "Generando..." : "Generar presentación"}
                    </Button>
                </div>
            
        </DefaultLayout>
    );
}
