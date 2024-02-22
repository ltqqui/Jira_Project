import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DOMAIN, http } from '../../setting/config';
import axios from 'axios';

const initialState = {

}

const TestReducer = createSlice({
  name: 'TestReducer',
  initialState,
  reducers: {}
});

export const {} = TestReducer.actions

export default TestReducer.reducer

// export const testLogin = createAsyncThunk("TestReducer/testLogin", async () => {
//     const promise= new Promise(()=>{
        
//     })
//   });
  