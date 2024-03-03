import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTaskDetail } from './ProjectReducer';
import { STATUS_CODE, http } from '../../setting/config';





const initialState = {

}

const TaskCommentReducer = createSlice({
  name: "TaskCommentReducer",
  initialState,
  reducers: {}
});

export const {} = TaskCommentReducer.actions

export default TaskCommentReducer.reducer

export const insertCommentApi=createAsyncThunk("TaskCommentReducer/insertComment",
  async(content:any,{dispatch} )=>{
    const{data, status}= await http.post('Comment/insertComment',content);
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId));
    }
  }
)

export const deleteCommentApi=createAsyncThunk("TaskCommentReducer/deleteCommentApi",
  async({idComment,taskId}:{idComment:number, taskId:number},{dispatch})=>{
    const {data, status}= await http.delete(`Comment/deleteComment?idComment=${idComment}`);
    console.log(data)
    if(status===STATUS_CODE.SUCCESS){
        dispatch(getTaskDetail(taskId));
    }
  }
)

export const updateCommentApi=createAsyncThunk("TaskCommentReducer/updateCommentApi",
  async({id, content, taskId}:{id:number, content:string, taskId:number},{dispatch})=>{
    console.log(id,content)
    const{data, status}= await http.put(`Comment/updateComment?id=${id}&contentComment=${content}`);
    console.log(data)
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(taskId))
    }
  }
)