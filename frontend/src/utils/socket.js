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
export function connectExecutionWebSocket(onMessage, onOpen, onClose, onError) {
    const wsUrl = getWebSocketUrl(backendWsUrl);
    const url = `${wsUrl}/execution`;

    console.log('Connecting to execution WebSocket:', url);

    const ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;

    return ws;
}

// 🔌 Hocuspocus/Yjs WebSocket provider
export function createHocuspocusProvider(documentName, ydoc) {
    const wsUrl = getWebSocketUrl(backendWsUrl);
    const url = `${wsUrl}/yjs`;

    console.log('Connecting to Hocuspocus WebSocket:', url);

    return new HocuspocusProvider({
        url,
        name: documentName,
        document: ydoc,
    });
}

// 🔌 Optional helper for creating both ydoc and provider
export function connectHocuspocus(documentName) {
    const ydoc = new Y.Doc();
    const provider = createHocuspocusProvider(documentName, ydoc);
    return { ydoc, provider };
}