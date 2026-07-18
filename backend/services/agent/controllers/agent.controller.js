import axios from "axios";
import {graph} from "../graph/graph.js";
import redis from '../../../shared/redis/redis.js';
import {addMessage} from "../config/memory.js";
export const agent=async(req,res)=>{
    try{
        const {prompt,conversationId,agent}=req.body;
       
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{
            content: prompt,
            conversationId,
            role: "user"
        });
        const result=await graph.invoke({prompt,conversationId,agent});
        const response=result.aiResponse;
       await addMessage(conversationId,"user",prompt);
        await addMessage(conversationId,"assistant",response);
             await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{
            content: response,
            conversationId,
            role: "assistant",
            images: result.images
        });
        return res.status(200).json({answer : result.aiResponse,
images : result.images

        });
    }catch(err){
        res.status(500).json({error:"Agent Error",message:err});
    }
}