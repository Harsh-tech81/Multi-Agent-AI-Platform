import { createSlice } from "@reduxjs/toolkit";

const messageSlice=createSlice({
    name:"message",
    initialState:{
        messages:[]
    },
    reducers:{
       setMessages:(state,action)=>{
        state.messages=action.payload;
       },
       addMessage:(state,action)=>{
        const temp=state.messages.messages; // handle the error here state.messages.messages is an array of messages, so we need to access it correctly
        temp.push(action.payload);
       }
    }
});

export const {setMessages,addMessage}=messageSlice.actions;
export default messageSlice.reducer;