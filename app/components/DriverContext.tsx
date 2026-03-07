import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "https://curb-side-backend.onrender.com";

type DriverContextType = {
  socket: Socket | null;
};

export const DriverContext = createContext<DriverContextType>({
  socket: null,
});

type Props = {
  children: ReactNode;
};

export const DriverProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(SERVER_URL, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => {
      console.log("driver socket connected:", s.id);
    });

    s.on("disconnect", () => {
      console.log("driver socket disconnected");
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
  }, []);

  return <DriverContext.Provider value={{ socket }}>{children}</DriverContext.Provider>;
};