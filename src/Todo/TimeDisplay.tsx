import { useState, useMountEffect } from "rask-ui";

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) {
    return seconds <= 0 ? "just now" : `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TimeDisplay(props: { timestamp: number }) {
  const state = useState({
    updateTrigger: 0,
  });

  useMountEffect(() => {
    const interval = setInterval(() => {
      state.updateTrigger += 1;
    }, 30000);

    return () => clearInterval(interval);
  });

  return () => (
    <span class="text-xs text-gray-400 leading-none">
      {state.updateTrigger >= 0 ? `updated ${formatTimeAgo(props.timestamp)}` : ""}
    </span>
  );
}
