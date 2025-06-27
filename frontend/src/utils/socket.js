const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const host = window.location.host;

// ✅ Execution WebSocket Connector
export function connectExecutionWebSocket(onMessage, onOpen, onClose, onError) {
    const url = `${wsProtocol}://${host}/execution`;
    const ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
    return ws;
}

// ✅ Hocuspocus WebSocket Connector (Yjs)
export function createHocuspocusProvider(documentName, ydoc) {
    const url = `${wsProtocol}://${host}/yjs`;
    return new HocuspocusProvider({
        url,
        name: documentName,
        document: ydoc,
    });
}
