"use client";

import { ReactNode } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Toaster } from "sonner"; 
import clsx from "clsx";

interface DefaultLayoutProps {
    title?: string;
    titleIcon?: ReactNode;
    description?: string;
    children: ReactNode;
    loading?: boolean;
}

export default function DefaultLayout({
    title,
    titleIcon,
    description,
    children,
    loading = false,
}: DefaultLayoutProps) {
    return (
        <div className="relative flex justify-center items-start py-4 h-full">
            <Card className="w-full mx-auto shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm flex flex-col flex-1 min-h-0 gap-2">
                <CardHeader>
                    {title && (
                        <CardTitle className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-2">
                            {titleIcon && <span className="text-blue-900">{titleIcon}</span>}
                            {title}
                        </CardTitle>
                    )}
                    {description && (
                        <CardDescription className="text-gray-700 mt-2 text-sm md:text-base">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="flex-1 min-h-0">
                    {/* ✅ Aquí el único scroll */}
                    <div className={clsx("", { "pointer-events-none cursor-wait": loading })}>
                        {children}
                    </div>
                </CardContent>
            </Card>
            {/* ✅ Toaster global disponible en toda la app */}
            <Toaster richColors position="top-right" />
        </div>
    );
}
