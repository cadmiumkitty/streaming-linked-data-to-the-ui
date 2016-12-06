export const CONNECT_STOMP = 'CONNECT_STOMP';
export const CONNECTED_STOMP = 'CONNECTED_STOMP';
export const DISCONNECT_STOMP = 'DISCONNECT_STOMP';
export const DISCONNECTED_STOMP = 'DISCONNECTED_STOMP';
export const UPDATE_SOW = 'UPDATE_SOW';
export const DELETE_FROM_SOW = "DELETE_FROM_SOW";

export const connectStomp = () => ({
	type: CONNECT_STOMP
	});

export const connectedStomp = () => ({
	type: CONNECTED_STOMP
	});

export const disconnectStomp = () => ({
	type: DISCONNECT_STOMP
	});

export const disconnectedStomp = () => ({
	type: DISCONNECTED_STOMP
	});

export const updateSow = (graph) => ({
	type: UPDATE_SOW,
	graph
});

export const deleteFromSow = (graph) => ({
	type: DELETE_FROM_SOW,
	graph
});