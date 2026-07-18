import { createSlice } from "@reduxjs/toolkit";

const conversationSlice=createSlice({
    name:"conversation",
    initialState:{
        conversations:[],
        selectedConversation:null
    },
    
    reducers:{
       setConversations:(state,action)=>{
        state.conversations=action.payload?.conversations !== undefined ? action.payload.conversations : (action.payload || []);
       },
       addConversation:(state,action)=>{
        state.conversations.unshift(action.payload);
       },
       setSelectedConversation:(state,action)=>{
        state.selectedConversation=action.payload;
       },
       setConversationTitle:(state,action)=>{
        const {conversationId,title}=action.payload;
        state.conversations = state.conversations.map(conv => (
            conv._id === conversationId ? { ...conv, title } : conv
        ))
          state.selectedConversation = state.selectedConversation && state.selectedConversation._id === conversationId
            ? { ...state.selectedConversation, title }
            : state.selectedConversation;
    }
    }
});

export const {setConversations, addConversation, setSelectedConversation, setConversationTitle}=conversationSlice.actions;
export default conversationSlice.reducer;