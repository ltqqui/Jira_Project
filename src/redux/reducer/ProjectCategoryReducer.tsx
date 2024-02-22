import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { http } from '../../setting/config';
import { ProjectState } from './ProjectReducer';


export type ProjectCategoryModel={
    id:number;
    projectCategoryName:string;
}

export type ProjectCategoryState={
    projectCategory:ProjectCategoryModel[]|[]
}

const initialState:ProjectCategoryState = {
    projectCategory:[]
}

const ProjectCategoryReducer = createSlice({
  name: 'ProjectCategoryReducer',
  initialState,
  reducers: {},
  extraReducers(builder){
    builder.addCase(getProjectCategoryApi.fulfilled, (state:ProjectCategoryState, action:PayloadAction<ProjectCategoryModel[]>)=>{
        state.projectCategory= action.payload
    })
  }
});

export const {} = ProjectCategoryReducer.actions

export default ProjectCategoryReducer.reducer

export const getProjectCategoryApi=createAsyncThunk("ProjectCategoryReducer/getProjectCategoryApi",
    async ()=>{
        const {data, status}= await http.get("ProjectCategory");
        return data.content;
    }
)
