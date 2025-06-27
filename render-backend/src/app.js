import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: './.env' });

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Improved proxy configuration with better WebSocket handling
const yjsProxy = createProxyMiddleware({
  target: 'http://localhost:1234',
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/yjs': '' },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('YJS Proxy Error:', err);
  },
  onProxyReqWs: (proxyReq, req, socket) => {
    console.log('YJS WebSocket proxy request');
  },
});

const executionProxy = createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/execution': '' },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Execution Proxy Error:', err);
  },
  onProxyReqWs: (proxyReq, req, socket) => {
    console.log('Execution WebSocket proxy request');
  },
});

app.use('/yjs', yjsProxy);
app.use('/execution', executionProxy);

// Your existing routes...
import roomRoutes from './routes/roomRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

app.use('/api/rooms', roomRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

// ✅ CRITICAL: Handle WebSocket upgrades manually
server.on('upgrade', (request, socket, head) => {
  console.log('WebSocket upgrade request for:', request.url);

  if (request.url.startsWith('/yjs')) {
    yjsProxy.upgrade(request, socket, head);
  } else if (request.url.startsWith('/execution')) {
    executionProxy.upgrade(request, socket, head);
  } else {
    // Handle Socket.IO upgrades
    socket.destroy();
  }
});

import { Server as SocketServer } from 'socket.io';
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

import { handleChatSocket } from './socket/socket.js';
handleChatSocket(io);

export { server, io };