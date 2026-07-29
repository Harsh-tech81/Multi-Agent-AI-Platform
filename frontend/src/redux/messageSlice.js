import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages =
        action.payload?.messages !== undefined
          ? action.payload.messages
          : action.payload || [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setArtifacts: (state, action) => {
      state.artifacts =
        action.payload?.artifacts !== undefined
          ? action.payload.artifacts
          : action.payload || [];
    },
  },
});

export const { setMessages, addMessage, setArtifacts } = messageSlice.actions;
export default messageSlice.reducer;
