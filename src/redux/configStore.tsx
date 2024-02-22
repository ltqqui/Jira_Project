import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import LoadingReducer from './reducer/LoadingReducer';
import ProjectReducer from './reducer/ProjectReducer';
import ProjectCategoryReducer from './reducer/ProjectCategoryReducer';
import UserReducer from "./reducer/UserReducer";
import DrawerJiraReducer from "./reducer/DrawerJiraReducer";
const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
  })
export const store=configureStore({
    reducer:{
        UserReducer,
        LoadingReducer,
        ProjectReducer,
        ProjectCategoryReducer,
        DrawerJiraReducer
    },
    middleware:customizedMiddleware
})

export type RootState= ReturnType <typeof store.getState>;
export type DispatchType = typeof store.dispatch;
