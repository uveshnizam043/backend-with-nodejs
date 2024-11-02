// redis/pubSubService.js
import {pubSubClient  } from "../config/redis.js";

// Subscribe to document updates
const subscribeToDocumentUpdates = (channel, onMessage) => {
  pubSubClient.subscribe(channel);
  pubSubClient.on('message', (channel, message) => {
    onMessage(JSON.parse(message));
  });
};

// Publish document updates
const publishDocumentUpdate = (channel, message) => {
  pubSubClient.publish(channel, JSON.stringify(message));
};

export {subscribeToDocumentUpdates, publishDocumentUpdate };
