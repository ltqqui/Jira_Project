import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading:false
}

const LoadingReducer = createSlice({
  name: 'LoadingReducer',
  initialState,
  reducers: {
    setLoading:(state, action)=>{
        state.isLoading=action.payload;
    },
  }
});

export const {setLoading} = LoadingReducer.actions

export default LoadingReducer.reducer