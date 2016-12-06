import { combineReducers } from 'redux';
import { CONNECT_STOMP, CONNECTED_STOMP, DISCONNECT_STOMP, DISCONNECTED_STOMP, UPDATE_SOW } from '../actions';

const connection = (state = {
		connected: false
}, action) => {
	switch (action.type) {
		case CONNECT_STOMP:
			return {
				...state,
    			connected: false,
    			connecting: true,
    			disconnecting: false
    		};
		case CONNECTED_STOMP:
			return {
				...state,
    			connected: true,
    			connecting: false,
    			disconnecting: false
    		};
		case DISCONNECT_STOMP:
			return {
				...state,
				connected: true,
				connecting: false,
				disconnecting: true
			};
		case DISCONNECTED_STOMP:
			return {
				...state,
				connected: false,
				connecting: false,
				disconnecting: false
			};
		default:
			return state;
	}
}

const sow = (state = {
		graph: {}
}, action) => {
	switch (action.type) {
		case UPDATE_SOW:
			return {
				...state,
				graph: action.graph
			};
		case DISCONNECT_STOMP:
			return {
				...state,
				graph: {}
			};			
		case DISCONNECTED_STOMP:
			return {
				...state,
				graph: {}
			};			
		default:
			return state;
	}			
}

const reducer = combineReducers({
	connection,
	sow
});

export default reducer;