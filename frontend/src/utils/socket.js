import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

// ✅ Safely get backend host from .env
const backendHost = import.meta.env.VITE_BACKEND_WS || window.location.host;

// ✅ Choose correct protocol
const wsProtocol = backendHost.startsWith('https')
    ? 'wss'
    : backendHost.startsWith('http')
        ? 'ws'
        : window.location.protocol === 'https:' ? 'wss' : 'ws';

// ✅ Construct full WebSocket URL
const baseWsUrl = backendHost.startsWith('http')
    ? backendHost.replace(/^https?/, wsProtocol)
    : `${wsProtocol}://${backendHost}`;

// 🔌 Execution WebSocket connector
export function connectExecutionWebSocket(onMessage, onOpen, onClose, onError) {
    const url = `${baseWsUrl}/execution`;
    const ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
    return ws;
}

// 🔌 Hocuspocus/Yjs WebSocket provider
export function createHocuspocusProvider(documentName, ydoc) {
    const url = `${baseWsUrl}/yjs`;
    return new HocuspocusProvider({
        url,
        name: documentName,
        document: ydoc,
    });
}

// Optional helper if you want to use this pattern
export function connectHocuspocus(documentName) {
    const ydoc = new Y.Doc();
    const provider = createHocuspocusProvider(documentName, ydoc);
    return { ydoc, provider };
}
