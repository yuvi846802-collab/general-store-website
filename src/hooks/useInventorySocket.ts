import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export const useInventorySocket = (onUpdate?: () => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('inventory:updated', (data) => {
      console.log('Real-time inventory update received:', data);
      if (onUpdateRef.current) {
        onUpdateRef.current();
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
