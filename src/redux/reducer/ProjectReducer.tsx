import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DOMAIN, STATUS_CODE, http } from "../../setting/config";
import { setLoading } from "./LoadingReducer";
import { openNotificationWithIcon } from "../../utils/lib/Nontification";
import { set } from "lodash";
import Axios from "axios"
import axios from "axios";

export type ProjectListModel = {
  members: MemberModel[];
  creator: CreatorModel;
  id: number;
  projectName: string;
  descriptions: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
};

export type MemberModel = {
  userId: number;
  name: string;
  avatar: string;
};
export type CreatorModel = {
  id: number;
  name: string;
};

export type CreateProjectModel = {
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
};

export type ProjectDetailModel={
  lstTask:         LstTask[];
  members:         Member[];
  creator:         Creator;
  id:              number;
  projectName:     string;
  description:     string;
  projectCategory: Creator;
  alias:           string;
}
export type Creator= {
  id:   number;
  name: string;
}

export type LstTask ={
  lstTaskDeTail: LstTaskDeTail[];
  statusId:      string;
  statusName:    string;
  alias:         string;
}

export type LstTaskDeTail ={
  priorityTask:          PriorityTask;
  taskTypeDetail:        TaskTypeDetail;
  assigness:             Assigness[];
  lstComment:            LstComment[];
  taskId:                number;
  taskName:              string;
  alias:                 string;
  description:           string;
  statusId:              string;
  originalEstimate:      number;
  timeTrackingSpent:     number;
  timeTrackingRemaining: number;
  typeId:                number;
  priorityId:            number;
  projectId:             number;
}

export type Assigness ={
  id:     number;
  avatar: string;
  name:   string;
  alias:  string;
}

export type LstComment= {
  id:             number;
  idUser:         number;
  name:           string;
  avatar:         string;
  commentContent: string;
}

export type PriorityTask= {
  priorityId: number;
  priority:   string;
}

export type TaskTypeDetail ={
  id:       number;
  taskType: string;
}

export type Member= {
  userId:      number;
  name:        string;
  avatar:      string;
  email:       null;
  phoneNumber: null;
}

export type ProjectUpdateModel={
  id:number;
  projectName:string;
  categoryId:number;
  description:string;
}

export type ListUseModel={
  userId:number;
  name:string;
  avatar:string;
  email:string;
  phoneNumber:string;
}


export type ProjectState = {
  projectList: ProjectListModel[];
  projectDetail:ProjectDetailModel | null;
  listUser:ListUseModel[];
};

const initialState: ProjectState = {
  projectList: [],
  projectDetail:null,
  listUser:[]
}
const ProjectReducer = createSlice({
  name: "ProjectReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getAllProjectApi.fulfilled,
      (state: ProjectState, action: PayloadAction<ProjectListModel[]>) => {
        state.projectList = action.payload;
      }
    )
    builder.addCase(
      getProjectDetailApi.fulfilled,
      (state: ProjectState, action: PayloadAction<ProjectDetailModel>) => {
        state.projectDetail = action.payload;
      }
    )
    builder.addCase(getUserApi.fulfilled,(state:ProjectState, action:PayloadAction<ListUseModel[]>)=>{
      state.listUser=action.payload;
    })
  },
});

export const {} = ProjectReducer.actions;

export default ProjectReducer.reducer;

export const getAllProjectApi = createAsyncThunk(
  "ProjectReducer/getAllProjectAip",
  async (text: string | number, { dispatch }) => {
    // console.log(text)
    dispatch(setLoading(true));
    if (text === "") {
      const { data, status } = await http.get("Project/getAllProject");
      if (status === STATUS_CODE.SUCCESS) {
        dispatch(setLoading(false));
      }
      dispatch(setLoading(false));
      return data.content;
    } 
    else {
      const { data, status } = await http.get(
        `Project/getAllProject?keyword=${text}`
      );
      if (status === STATUS_CODE.SUCCESS) {
        dispatch(setLoading(false));
      }
      dispatch(setLoading(false));
      return data.content;
    }
  }
);

export const createProjectApi = createAsyncThunk(
  "ProjectReducer/createProjectApi",
  async (project: CreateProjectModel, { dispatch }) => {
    dispatch(setLoading(true));
    const { data, status } = await http.post(
      "Project/createProjectAuthorize",
      project
    );
    if (status === STATUS_CODE.SUCCESS) {
      dispatch(setLoading(false));
      openNotificationWithIcon("success", "Create successful !");
    } else dispatch(setLoading(false));
  }
);

export const deleteProjectApi = createAsyncThunk(
  "ProjectReducer/createProjectApi",
  async (id: number, { dispatch }) => {
    dispatch(setLoading(true));
    const { data, status } = await http.delete(
      `Project/deleteProject?projectId=${id}`
    );
    console.log(data);
    if (status === STATUS_CODE.SUCCESS) {
      await dispatch(setLoading(false));
      await dispatch(getAllProjectApi(""));
      await openNotificationWithIcon("success", "Delete successful !");
    } else dispatch(setLoading(false));
  }
);


export const getProjectDetailApi= createAsyncThunk("ProjectReducer/getProjectDetailApi",
  async(id:number,{dispatch})=>{
    const {data, status}= await http.get(`Project/getProjectDetail?id=${id}`);
    return data.content;
  }
)

export const updateProjectApi=createAsyncThunk("ProjectReducer/updateProjectApi",
  async(projectUpdate:ProjectUpdateModel,{dispatch})=>{
    dispatch(setLoading(true));
    const {data, status}= await http.put(`Project/updateProject?projectId=${projectUpdate.id}`,projectUpdate)
    if(status===STATUS_CODE.SUCCESS){
      await dispatch(setLoading(false));
      await dispatch(getAllProjectApi(""));
      await openNotificationWithIcon("success","Update success !!");
    }
    else dispatch(setLoading(false))
    console.log(data)
  }
)
export const getUserApi= createAsyncThunk("UserReducer/getUserApi",
async(key:string)=>{
  if(key!==''){
    const {data, status}= await http.get(`Users/getUser?keyword=${key}`);
    return data.content;
  }
  else{
    const {data, status}= await http.get(`Users/getUser`);
    return data.content;
  }
}
)
export const assignUserProject= createAsyncThunk("ProjectReducer/assignUserProject",
  async(info:any,{dispatch})=>{
    const{data, status}= await http.post("Project/assignUserProject", info);
    if(status===STATUS_CODE.SUCCESS){
      await dispatch(getAllProjectApi(""));
      await openNotificationWithIcon('success',"Assign success !")
    }
    else{
      openNotificationWithIcon("error","You do not have permission to perform this operation !!!")
    }
  }
)


export const removeUserProjectApi=createAsyncThunk("ProjectReducer/removeUserProjectApi",
  async(info:any, {dispatch})=>{
    const {data, status}= await http.post('Project/removeUserFromProject', info);
    if(status===STATUS_CODE.SUCCESS){
      await dispatch(getAllProjectApi(""));
      await openNotificationWithIcon('success',"Remove success !")
    }
    else{
      openNotificationWithIcon("error","You do not have permission to perform this operation !!!")
    }
  }
)



