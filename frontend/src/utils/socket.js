import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

// ✅ Get backend URLs from environment variables
const backendHttpUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const backendWsUrl = import.meta.env.VITE_BACKEND_WS || backendHttpUrl;

// ✅ Function to convert HTTP/HTTPS URL to WebSocket URL
function getWebSocketUrl(url) {
    // Remove trailing slash if present
    const cleanUrl = url.replace(/\/$/, '');

    // Convert HTTP/HTTPS to WS/WSS
    if (cleanUrl.startsWith('https://')) {
        return cleanUrl.replace('https://', 'wss://');
    } else if (cleanUrl.startsWith('http://')) {
        return cleanUrl.replace('http://', 'ws://');
    }

    // If no protocol, assume based on current page protocol
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    return `${protocol}${cleanUrl}`;
}

// 🔌 Execution WebSocket connector
// 🔌 Execution WebSocket connector with retry logic
export function connectExecutionWebSocket(onMessage, onOpen, onClose, onError) {
    const wsUrl = getWebSocketUrl(backendWsUrl);
    const url = `${wsUrl}/execution`;

    console.log('Connecting to execution WebSocket:', url);

    const ws = new WebSocket(url);

    ws.onopen = (event) => {
        console.log('Execution WebSocket connected');
        onOpen(event);
    };

    ws.onmessage = onMessage;

    ws.onerror = (error) => {
        console.error('Execution WebSocket error:', error);
        onError(error);
    };

    ws.onclose = (event) => {
        console.log('Execution WebSocket closed:', event.code, event.reason);
        onClose(event);
    };

    return ws;
}

// 🔌 Hocuspocus/Yjs WebSocket provider with better error handling
export function createHocuspocusProvider(documentName, ydoc) {
    const wsUrl = getWebSocketUrl(backendWsUrl);
    const url = `${wsUrl}/yjs`;

    console.log('Connecting to Hocuspocus WebSocket:', url);

    const provider = new HocuspocusProvider({
        url,
        name: documentName,
        document: ydoc,
        onConnect: () => {
            console.log('Hocuspocus connected');
        },
        onDisconnect: () => {
            console.log('Hocuspocus disconnected');
        },
        onStatus: ({ status }) => {
            console.log('Hocuspocus status:', status);
        },
    });

    return provider;
}