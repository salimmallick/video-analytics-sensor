import { useEffect, useRef, useState } from 'react';

export function useWebSocket<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        setError(new Error('Failed to parse WebSocket data'));
      }
    };

    ws.onerror = (event) => {
      setError(new Error('WebSocket error occurred'));
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, error };
}