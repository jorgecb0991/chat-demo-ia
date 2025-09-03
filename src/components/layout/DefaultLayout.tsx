"use client";

import { ReactNode } from "react";

interface DefaultLayoutProps {
    title?: string;
    titleIcon?: ReactNode;
    description?: string;
    children: ReactNode;
    loading?: boolean;
    loadingMessage?: string;
    loadingIcon?: ReactNode; // opcional: para custom loader (YouTube, spinner, etc.)
}

export default function DefaultLayout({
    title,
    titleIcon,
    description,
    children,
    loading = false,
    loadingMessage = "Cargando...",
    loadingIcon,
}: DefaultLayoutProps) {
    return (
        <div className="relative p-6 max-w-3xl mx-auto space-y-6 font-sans">
            {/* Overlay de carga */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    {loadingIcon ? (
                        <>{loadingIcon}</>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                            <p className="text-white text-lg font-semibold">{loadingMessage}</p>
                        </>
                    )}
                </div>
            )}

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 text-black">
                {/* Header */}
                {(title || description) && (
                    <div className="mb-6">
                        {title && (
                            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                                {titleIcon && <span className="text-blue-900">{titleIcon}</span>}
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-gray-700 mt-2">{description}</p>
                        )}
                    </div>
                )}

                {/* Contenido dinámico */}
                {children}
            </div>
        </div>
    );
}
