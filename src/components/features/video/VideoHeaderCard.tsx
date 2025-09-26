"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Clock, Film } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface VideoHeaderCardProps {
    thumbnail: string;
    videoTitle: string;
    description: string;
    duration: string;
    publishedAgo: string;
    views: string;
    channelName: string;
    channelAvatar: string;
    videoUrl: string;
}

export default function VideoHeaderCard({
    thumbnail,
    videoTitle,
    description,
    duration,
    publishedAgo,
    views,
    channelName,
    channelAvatar,
    videoUrl,
}: VideoHeaderCardProps) {
    const [copied, setCopied] = useState(false);
    // Nuevo estado para rastrear si la carga del avatar ha fallado
    const [hasAvatarFailed, setHasAvatarFailed] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(videoUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Error copiando enlace:", err);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Miniatura */}
            <div className="relative w-full md:w-[200px] aspect-[16/9] flex-shrink-0">
                <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                >
                    <Avatar className="w-full h-full rounded-xl cursor-pointer">
                        <AvatarImage
                            src={thumbnail || undefined}
                            alt={videoTitle}
                            className="object-cover hover:opacity-90 transition-opacity"
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                            N/A
                        </AvatarFallback>
                    </Avatar>
                </a>
            </div>

            {/* Texto */}
            <div className="flex-1 flex flex-col justify-start">
                {/* 1. Título */}
                <h4 className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl leading-snug mb-2 line-clamp-2 hover:text-blue-700 transition-colors duration-200">
                    {videoTitle}
                </h4>

                {/* 2. Views + PublishedAgo + Duration */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {views}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {publishedAgo}
                    </span>
                    <span className="flex items-center gap-1">
                        <Film className="w-4 h-4" /> {duration}
                    </span>
                </div>

                {/* 3. Channel Avatar + Title */}
                <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-full rounded-xl cursor-pointer">
                        {/* Se muestra AvatarImage solo si la carga no ha fallado */}
                        {!hasAvatarFailed && (
                            <AvatarImage
                                src={channelAvatar || undefined}
                                alt={channelName}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={() => setHasAvatarFailed(true)} // Si falla la carga, actualiza el estado
                            />
                        )}
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                            N/A
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                        {channelName}
                    </span>
                </div>

                {/* 4. Copiar Video URL */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 truncate flex-1">{videoUrl}</span>
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                    >
                        <Copy size={16} />
                    </Button>
                    {copied && (
                        <span className="text-xs text-green-600 ml-1">Copiado!</span>
                    )}
                </div>
            </div>
        </div>
    );
}
