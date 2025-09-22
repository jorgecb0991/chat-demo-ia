import { ClipboardList, FileText, Globe, Link, BookOpen, PenTool } from "lucide-react";
import { motion } from "framer-motion";

interface SourceHeaderCardProps {
    sourceType?: "topic" | "text" | "file" | "webpage" | "manual";
    title?: string;
    description?: string;
}

const icons = {
    topic: <BookOpen className="w-5 h-5 text-utec-cyan" />,
    text: <FileText className="w-5 h-5 text-utec-verde" />,
    file: <ClipboardList className="w-5 h-5 text-utec-naranja" />,
    webpage: <Link className="w-5 h-5 text-utec-azul-secundario" />,
    manual: <PenTool className="w-5 h-5 text-utec-azul-principal" />,
};

const getSourceTitle = (sourceType: SourceHeaderCardProps["sourceType"]): string => {
    switch (sourceType) {
        case "topic":
            return "Tema";
        case "text":
            return "Texto";
        case "file":
            return "Archivo";
        case "webpage":
            return "Página Web";
        case "manual":
            return "Creación Manual";
        default:
            return "Fuente";
    }
};

export default function SourceHeaderCard({
    sourceType = "text",
    title,
    description,
}: SourceHeaderCardProps) {
    const sourceTitle = getSourceTitle(sourceType);
    const icon = icons[sourceType] || <ClipboardList className="w-5 h-5 text-gray-400" />;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full rounded-2xl p-4 sm:p-6 shadow-md overflow-hidden
                        bg-gradient-to-r from-[#00A3D7]/20 via-[#006AB5]/20 to-[#F5A623]/20"
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs sm:text-2xl">{icon}</span>
                <span className="text-xs sm:text-base font-semibold uppercase text-black">
                    Cuestionario generado de: {sourceTitle}
                </span>
            </div>
            <h1 className="text-xs sm:text-2xl font-bold mb-1 text-black">
                {title || "Cuestionario sin título"}
            </h1>
            <p className="text-xs sm:text-sm text-black">
                {description || "Descripción no disponible."}
            </p>
        </motion.div>
    );
}
