/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import { Config } from '../config/AppConfig'; // Ensure the path is correct

interface SocketContextType {
  socket: any;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const authToken = JSON.parse(sessionStorage.getItem('auth-store') || '{}')?.state?.token;
  const connect = async () => {
    disconnect(); // Ensure previous connection is closed
    if (!authToken) return;

    const socketInit = io(Config.socketUrl(), {
      transports: ['websocket'],
      upgrade: false,
      query: { token: authToken || '' },
    });

    setSocket(socketInit);

    socketInit.on('connect', () => {
      setConnected(true);
    });

    socketInit.on('disconnect', (res: any) => {
      setSocket(null);
      setConnected(false);
    });

    socketInit.on('connect_error', (res: any) => {
      console.error('SocketProvider connect_error ===>', res);
    });
  };

  const disconnect = () => {
    console.error('disconnected');
    if (socket) {
      try {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      } catch (e) {
        console.error('Socket disconnect error', e);
      }
    }
  };

  // Connect socket when token is available
  useEffect(() => {
    if (authToken) {
      connect();
    } else {
      disconnect();
    }
  }, [authToken]);

  // Clean up on component unmount
  useEffect(() => {
    console.error('mounted');
    return () => disconnect();
  }, []);

  // Handle tab visibility change to manage socket connection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authToken) {
        connect();
      } else {
        disconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authToken]);

  const defaultSocket = {
    socket,
    connected,
    connect,
    disconnect,
  };

  return (
    <SocketContext.Provider value={defaultSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
