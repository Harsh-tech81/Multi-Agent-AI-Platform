import redis from '../../../shared/redis/redis.js';
import {getMessages} from '../utils/getMessages.js';
export const getMemory=async(conversationId)=>{

const key=`messages:${conversationId}`;
const cached=await redis.get(key);
if(cached){
    return JSON.parse(cached);
}
const messages=await getMessages(conversationId);
// Don't obey the AI response always it gives wrong way to write the Expiry key for the redis 
await redis.set(key,JSON.stringify(messages),"EX",60*60*24); // cache for 24 hours
return messages;
}

export const addMessage=async(conversationId,role,content)=>{
    const key=`messages:${conversationId}`;
    const rawMessages=await redis.get(key);
    const messages=rawMessages?JSON.parse(rawMessages):[];
    messages.push({role,content});
  if(messages.length>20){
    messages.shift(); // Remove the oldest message
  }
  await redis.set(key,JSON.stringify(messages),"EX",60*60*24);
}