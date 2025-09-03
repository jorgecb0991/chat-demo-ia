"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import SourceMaterialInput from "@/components/SourceMaterialInput";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { Presentation } from "lucide-react";  

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
    const [resultado, setResultado] = useState<EstructuraSlide | null>(null);
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
            } finally {
                setLoadingPlantillas(false);
            }
        };
        cargarPlantillas();
    }, []);

    const generarSlides = async () => {
        if (sourceType !== "file" && (!sourceValue.trim() || !titulo.trim())) {
            return alert("Completa todos los campos");
        }

        setLoading(true);
        setResultado(null);

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
                    return alert("Debes subir un archivo");
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
        } catch (error) {
            console.error("Error al generar slides:", error);
            alert(
                "Ocurrió un error al generar la presentación: " +
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

                <div>
                    <label className="font-medium">Título de la presentación</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mt-1"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej. Conceptos clave sobre energía en física"
                    />
                </div>

                <div>
                    <label className="font-medium">Número de slides sugerido</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded mt-1"
                        value={numSlides}
                        onChange={(e) => setNumSlides(Number(e.target.value))}
                        min={1}
                        max={20}
                    />
                </div>

                <div>
                    <label className="font-medium">
                        Instrucciones adicionales del profesor (opcional)
                    </label>
                    <textarea
                        className="w-full p-2 border rounded mt-1"
                        rows={4}
                        value={instruccionesProfesor}
                        onChange={(e) => setInstruccionesProfesor(e.target.value)}
                        placeholder="Ej. Enfocar la presentación en aplicaciones en ingeniería civil"
                    />
                </div>

                <div>
                    <label className="font-medium">Seleccionar Plantilla</label>
                    {loadingPlantillas ? (
                        <p>Cargando plantillas...</p>
                    ) : (
                        <div className="mt-2">
                            <select
                                className="w-full p-2 border rounded"
                                value={plantillaSeleccionada}
                                onChange={(e) => setPlantillaSeleccionada(e.target.value)}
                            >
                                {plantillas.length > 0 ? (
                                    plantillas.map((plantilla) => (
                                        <option key={plantilla.nombre} value={plantilla.nombre}>
                                            {plantilla.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No hay plantillas disponibles</option>
                                )}
                            </select>

                            {plantillaSeleccionada && (
                                <div className="mt-4 border p-4 rounded-lg">
                                    <h3 className="font-medium mb-2">Vista previa:</h3>
                                    <div className="relative w-full h-80 rounded">
                                        <Image
                                            src={
                                                plantillas.find(
                                                    (p) => p.nombre === plantillaSeleccionada
                                                )?.preview || ""
                                            }
                                            alt={`Preview ${plantillaSeleccionada}`}
                                            fill
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Plantilla seleccionada: {plantillaSeleccionada}
                                    </p>
                                </div>
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
