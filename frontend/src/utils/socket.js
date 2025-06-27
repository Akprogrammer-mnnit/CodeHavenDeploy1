// utils/socket.js
import { HocuspocusProvider } from '@hocuspocus/provider';

const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const host = window.location.host;

export function connectExecutionWebSocket(onMessage, onOpen, onClose, onError) {
    const url = `${wsProtocol}://${host}/execution`;
    const ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
    return ws;
}

export function createHocuspocusProvider(documentName, ydoc) {
    return new HocuspocusProvider({
        url: `${wsProtocol}://${host}/yjs`,
        name: documentName,
        document: ydoc,
    });
}

// ✅ Export this wrapper to match your usage
export function connectHocuspocus(documentName) {
    const ydoc = new Y.Doc(); // Make sure to import Y in this file
    const provider = createHocuspocusProvider(documentName, ydoc);
    return { ydoc, provider };
}
