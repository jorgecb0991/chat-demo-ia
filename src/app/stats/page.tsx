"use client";

import { useEffect, useState } from "react";

interface Estadistica {
    curso: string;
    modo: string;
    timestamp: number;
    mensaje: string;
}

export default function Estadisticas() {
    const [registros, setRegistros] = useState<Estadistica[]>([]);
    const [totales, setTotales] = useState({
        totalMensajes: 0,
        porModo: {} as Record<string, number>,
        porCurso: {} as Record<string, number>,
    });

    useEffect(() => {
        fetch("/api/stats")
            .then(res => res.json())
            .then(({ registros }) => {
                setRegistros(registros);

                const modoStats: Record<string, number> = {};
                const cursoStats: Record<string, number> = {};

                for (const r of registros) {
                    modoStats[r.modo] = (modoStats[r.modo] || 0) + 1;
                    cursoStats[r.curso] = (cursoStats[r.curso] || 0) + 1;
                }

                setTotales({
                    totalMensajes: registros.length,
                    porModo: modoStats,
                    porCurso: cursoStats,
                });
            });
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">📊 Estadísticas de Uso</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-600 p-4 rounded shadow text-center text-white">
                    <p className="text-sm text-blue-100">Total mensajes</p>
                    <p className="text-2xl font-bold">{totales.totalMensajes}</p>
                </div>

                {Object.entries(totales.porModo).map(([modo, cantidad]) => (
                    <div key={modo} className="bg-green-600 p-4 rounded shadow text-center text-white">
                        <p className="text-sm text-green-100">Modo: {modo}</p>
                        <p className="text-2xl font-bold">{cantidad}</p>
                    </div>
                ))}

                {/*Object.entries(totales.porCurso).map(([curso, cantidad]) => (
                    <div key={curso} className="bg-yellow-500 p-4 rounded shadow text-center text-gray-900">
                        <p className="text-sm text-yellow-100">Curso: {curso}</p>
                        <p className="text-2xl font-bold">{cantidad}</p>
                    </div>
                ))*/}
            </div>


            <h2 className="text-xl font-semibold mb-4">🕒 Últimos mensajes</h2>
            <div className="space-y-3">
                {registros.slice(-10).reverse().map((registro, i) => (
                    <div key={i} className="shadow p-3 rounded border">
                        <p><strong>Curso:</strong> {registro.curso}</p>
                        <p><strong>Modo:</strong> {registro.modo}</p>
                        <p><strong>Fecha:</strong> {new Date(registro.timestamp).toLocaleString()}</p>
                        <p><strong>Mensaje:</strong> {registro.mensaje}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
