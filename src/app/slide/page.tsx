"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

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
  preview: string; // Ruta a la imagen de preview
  archivo: string; // Ruta al archivo PPTX
}

export default function SlideGeneratorPage() {
  const [tema, setTema] = useState("");
  const [titulo, setTitulo] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingPlantillas, setLoadingPlantillas] = useState(true);
  const [resultado, setResultado] = useState<EstructuraSlide | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const cargarPlantillas = async () => {
      try {
        const response = await fetch('/api/get-api-plantillas');
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
    if (!tema.trim() || !titulo.trim()) return alert("Completa todos los campos");

    setLoading(true);
    setResultado(null);
    setFileUrl(null);

    try {
      const response = await fetch("/api/generate-ppt", {
        method: "POST",
        body: JSON.stringify({
          tema,
          titulo,
          numSlides,
          plantilla: plantillaSeleccionada
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Error al generar PPT");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = titulo + ".pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setFileUrl(url);
    } catch (error) {
      console.error("Error al generar slides:", error);
      alert("Ocurrió un error al generar la presentación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-white text-lg font-semibold">Generando presentación...</p>
        </div>
      )}

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Generador de Presentaciones</h1>
        <p className="text-gray-600">Completa la información para generar tu presentación en base a un tema.</p>

        <div className="space-y-4">
          <div>
            <label className="font-medium">Tema</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej. Energía Cinética"
            />
          </div>

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
                  {plantillas.map((plantilla) => (
                    <option key={plantilla.nombre} value={plantilla.nombre}>
                      {plantilla.nombre}
                    </option>
                  ))}
                </select>

                {plantillaSeleccionada && (
                  <div className="mt-4 border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Vista previa:</h3>
                    <div className="relative w-full h-80 rounded">
                      <Image
                        src={plantillas.find(p => p.nombre === plantillaSeleccionada)?.preview || ''}
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
      </div>
    </>
  );
}
