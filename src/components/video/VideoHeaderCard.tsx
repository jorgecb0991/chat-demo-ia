"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

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
                <img
                    src={thumbnail}
                    alt={videoTitle}
                    className="rounded-xl w-full h-full object-cover"
                />
            </div>

            {/* Texto */}
            <div className="flex-1 flex flex-col justify-start">
                {/* 1. Título */}
                <h4 className="leading-tight font-semibold text-black text-base sm:text-lg mb-2 line-clamp-2">
                    {videoTitle}
                </h4>

                {/* 2. Views + PublishedAgo + Duration */}
                <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-3 mb-2">
                    <span>{views} views</span>
                    <span>{publishedAgo}</span>
                    <span>{duration}</span>
                </div>

                {/* 3. Channel Avatar + Title */}
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src={channelAvatar}
                        alt={channelName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
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
