import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import  messageReducer from './messageSlice'
import conversationReducer from './conversationSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer
  }
})