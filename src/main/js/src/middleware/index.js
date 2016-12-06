import { CONNECT_STOMP, DISCONNECT_STOMP, UPDATE_SOW, DELETE_FROM_SOW } from '../actions';
import { connectedStomp, disconnectedStomp, updateSow } from '../actions';

import 'stompjs/lib/stomp.js';
import SockJS from 'sockjs-client';
import * as jsonld from 'jsonld';

const createStompMiddleware = (stompClient) => {
	
	var stompClient = null;
	var stompSubscription = null;
	
	const onConnectionSuccess = store => frame => {
		stompSubscription = stompClient.subscribe("/topic/sow", onMessage(store));
		store.dispatch(connectedStomp());
	}
	
	const onConnectionError = store => error => {
		store.dispatch(disconnectedStomp());
	}
	
	const onDisconnectionSuccess = store => () => {
		store.dispatch(disconnectedStomp());
	}
	
	const onMessage = store => message => {
		var sow = JSON.parse(message.body);
		store.dispatch(updateSow(sow));
	}

	return store => next => action => {
		switch (action.type) {
			case CONNECT_STOMP:
				stompClient = Stomp.over(new SockJS("/linkeddata"));
				stompClient.connect({}, onConnectionSuccess(store), onConnectionError(store));
				break;
			case DISCONNECT_STOMP:
				stompSubscription.unsubscribe();
				stompClient.disconnect(onDisconnectionSuccess(store));
				break;
			case DELETE_FROM_SOW:
				var state = store.getState();
				const { sow: { graph } } = state;
				var delta = {
					['@graph']: [{
					    	['@graph']: [action.graph],
					    	['@id']: 'http://www.w3.org/2004/delta#deletion'
					    }],
					['@context']: graph['@context']
				}
				stompClient.send('/update', {}, JSON.stringify(delta));
				break;
			default:
				console.log("Some other action got called", action);
				return next(action);
		}
	}	
}

export default createStompMiddleware;