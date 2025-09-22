"use client";

import React from 'react';
import { useState, useEffect } from "react";
import Image from "next/image";
import { Presentation, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import SourceMaterialInput from "@/components/ui/source-material-input";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/common/SubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
    const [codProgram, setCodProgram] = useState("1");

    useEffect(() => {

        cargarPlantillas();
    }, []);

    const cargarPlantillas = async () => {
        try {
            setPlantillas([])
            const response = await fetch("/api/templates");
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

    const generarSlides = async () => {
        if (sourceType !== "file" && (!sourceValue.trim() || !titulo.trim())) {
            toast.warning("Completa todos los campos antes de continuar.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", titulo);
            formData.append("slideCount", numSlides.toString());
            formData.append("template", plantillaSeleccionada);
            formData.append("sourceValue", sourceValue);
            formData.append("codProgram", codProgram);

            if (instruccionesProfesor.trim()) {
                formData.append("instructionTeacher", instruccionesProfesor.trim());
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

            const response = await fetch("/api/presentations", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error desconocido");
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
            console.error(error);
            toast.error("No se pudo generar la presentación. Intenta de nuevo.");
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
        >

            <div className="space-y-4">
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
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                    {/* Título */}
                    <div className="flex-1 flex flex-col">
                        <Label htmlFor="titulo">Título de la presentación</Label>
                        <Input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej. Conceptos clave sobre energía en física"
                            className="mt-1"
                        />
                    </div>

                    {/* # Slides */}
                    <div className="w-28 flex flex-col">
                        <Label htmlFor="numSlides"># Slides</Label>
                        <Input
                            id="numSlides"
                            type="number"
                            value={numSlides}
                            onChange={(e) => setNumSlides(Number(e.target.value))}
                            min={1}
                            max={20}
                            className="mt-1"
                        />
                    </div>

                    {/* Nivel académico */}
                    <div className="w-40 flex flex-col">
                        <Label htmlFor="program">Nivel académico</Label>
                        <Select value={codProgram} onValueChange={setCodProgram}>
                            <SelectTrigger id="program" className="mt-1">
                                <SelectValue placeholder="Selecciona nivel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Pregrado</SelectItem>
                                <SelectItem value="2">Postgrado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="flex flex-col">
                    <Label htmlFor="instruccionesProfesor">
                        Instrucciones adicionales del profesor (opcional)
                    </Label>
                    <Textarea
                        id="instruccionesProfesor"
                        rows={3}
                        value={instruccionesProfesor}
                        onChange={(e) => setInstruccionesProfesor(e.target.value)}
                        placeholder="Ej. Enfocar la presentación en aplicaciones en ingeniería civil"
                        className="resize-none mt-1"
                    />
                </div>

                {/* Plantilla y vista previa */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                        <Label>Seleccionar Plantilla : </Label>
                        {plantillaSeleccionada && (
                            <span className="text-sm font-medium text-blue-600">
                                {plantillaSeleccionada}
                            </span>
                        )}
                    </div>
                    {loadingPlantillas ? (
                        <p className="text-sm text-muted-foreground">Cargando plantillas...</p>
                    ) : plantillas.length === 0 ? (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                No se pudieron cargar las plantillas. Intenta de nuevo más tarde.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="mt-1">
                            {/* Carrusel de plantillas en fila */}
                            <Carousel
                                opts={{ align: "start" }}
                                className="w-full"
                            >
                                <CarouselContent className="gap-2">
                                    {plantillas.map((plantilla) => (
                                        <CarouselItem key={plantilla.nombre} className="md:basis-1/2 lg:basis-1/3">
                                            <div
                                                className={`group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${plantillaSeleccionada === plantilla.nombre
                                                    ? "border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-300 ring-opacity-50"
                                                    : "border-transparent hover:border-gray-300"
                                                    }`}
                                                onClick={() => setPlantillaSeleccionada(plantilla.nombre)}
                                            >
                                                <Image
                                                    src={plantilla.preview}
                                                    alt={plantilla.nombre}
                                                    fill
                                                    className="object-contain select-none"
                                                />
                                                {plantillaSeleccionada === plantilla.nombre && (
                                                    <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-1 z-20">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-check size-4 text-white"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M20 6 9 17l-5-5"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    )}
                </div>
                {/* 
                    <SubmitButton
                    text="Generar presentación"
                    loadingText="Generando..."
                    size="lg"
                    onClick={generarSlides}
                    className=" py-4"
                    baseColor="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
                />
                */}
                <SubmitButton
                    text="Generar presentación"
                    loadingText={
                        <span className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generando...
                        </span>
                    }
                    size="lg"
                    onClick={generarSlides}
                    className=" py-4"
                />

            </div>

        </DefaultLayout>
    );
}
