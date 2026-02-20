import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface LastUpdatedProps {
  date: Date;
  isRefetching?: boolean;
  onRefresh?: () => void;
}

const LastUpdated = ({ date, isRefetching, onRefresh }: LastUpdatedProps) => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const updateSeconds = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      setSecondsAgo(diff);
    };

    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);

    return () => clearInterval(interval);
  }, [date]);

  const formatTime = () => {
    if (secondsAgo < 5) return "Just now";
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutes = Math.floor(secondsAgo / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <button
        onClick={onRefresh}
        disabled={isRefetching}
        className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh now"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
        />
      </button>
      <span>Updated {formatTime()}</span>
    </div>
  );
};

export default LastUpdated;
