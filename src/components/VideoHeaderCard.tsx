
interface VideoHeaderCardProps {
    thumbnail: string;
    title: string;
    description: string;
    duration: string;
    source: string;
    views: string;
    channelName: string;
    channelAvatar: string;
    videoUrl: string;
  }
export default function VideoHeaderCard({ thumbnail, title, description, duration, source, views, channelName, channelAvatar, videoUrl }:VideoHeaderCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex gap-6">
            {/* Miniatura */}
            <div className="relative w-[140px] sm:w-[180px] md:w-[200px] aspect-[16/9] flex-shrink-0">
                <img
                    src={thumbnail}
                    alt={title}
                    className="rounded-xl w-full h-full object-cover"
                />
            </div>

            {/* Texto */}
            <div className="flex-1 flex flex-col justify-center">
                <h4 className="leading-tight font-semibold text-black text-lg">{title}</h4>
                <p className="text-gray-600 line-clamp-2">{description}</p>

                <div className="text-sm text-gray-600 mt-3 flex items-center gap-3">
                    <img 
                        src={channelAvatar} 
                        alt={channelName} 
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{channelName}</span>
                    <span>{views}</span>
                    <span>{duration}</span>
                    <span>{source}</span>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-1">{videoUrl}</p>
            </div>
        </div>
    );
}
