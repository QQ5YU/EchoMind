import { io, Socket } from "socket.io-client";
import { logger } from "@renderer/shared/utils/logger";

class SocketClient {
  private static instance: SocketClient;
  public socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(url: string) {
    if (this.socket) return;

    logger.info("Connecting to WebSocket:", url);
    this.socket = io(url, {
      transports: ["websocket"],
      path: "/socket.io",
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      logger.info("WebSocket connected:", this.socket?.id);
    });

    this.socket.on("data", (payload) => {
      logger.debug("WebSocket recieved:", payload);
    });

    this.socket.on("disconnect", () => {
      logger.info("WebSocket disconnected");
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      logger.warn("Socket not initialized. Call connect() first.");
      return;
    }

    this.socket.on(event, callback);
  }

  public off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

export const socketClient = SocketClient.getInstance();
