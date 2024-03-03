import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DOMAIN, STATUS_CODE, http } from "../../setting/config";
import { setLoading } from "./LoadingReducer";
import { openNotificationWithIcon } from "../../utils/lib/Nontification";
import { set } from "lodash";
import Axios from "axios"
import axios from "axios";
import { RootState } from "../configStore";

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
  lstTask:         LstTaskModel[];
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

export type LstTaskModel ={
  lstTaskDeTail: TaskDeTailModel[];
  statusId:      string;
  statusName:    string;
  alias:         string;
}

export type TaskDeTailModel ={
  priorityTask:          PriorityTask;
  taskTypeDetail:        TaskDeTailModel;
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

export type TaskTypeModel ={
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

export type StatusModel={
  statusId:string;
  statusName:string;
  alias: string;
  deleted:boolean;
}

export type PriorityModel={
  priorityId:number;
  priority:string;
  description:string;
  deleted:boolean;
  alias:string;
}

export type TaskCreateModel={
  listUserAsign:number[];
   taskName:              string;
   description:           string;
   statusId:              string;
   originalEstimate:      number;
   timeTrackingSpent:     number;
   timeTrackingRemaining: number;
   projectId:             number;
   typeId:                number;
   priorityId:            number;
}

export type ProjectState = {
  projectList: ProjectListModel[];
  projectDetail:ProjectDetailModel | null;
  listUser:ListUseModel[];
  taskDetail:TaskDeTailModel |null;
  taskType: TaskTypeModel[];
  arrStatus:StatusModel[];
  arrPriority:PriorityModel[];
};


const initialState: ProjectState = {
  projectList: [],
  projectDetail:null,
  listUser:[],
  taskDetail:null,
  taskType:[],
  arrStatus:[],
  arrPriority:[],
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
    builder.addCase(getTaskDetail.fulfilled,(state:ProjectState, action:PayloadAction<TaskDeTailModel>)=>{
      state.taskDetail=action.payload;
    })
    builder.addCase(getTaskTypeApi.fulfilled, (state:ProjectState, action:PayloadAction<TaskTypeModel[]>)=>{
      state.taskType= action.payload;
    })
    builder.addCase(getStatusApi.fulfilled,(state:ProjectState, action:PayloadAction<StatusModel[]>)=>{
      state.arrStatus=action.payload;
    })
    builder.addCase(getPriorityApi.fulfilled,(state:ProjectState, action:PayloadAction<PriorityModel[]>)=>{
      state.arrPriority= action.payload;
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
async(key:string, {dispatch})=>{
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

export const getTaskDetail= createAsyncThunk("ProjectReducer/getTaskDetail",
  async(taskId:number)=>{
      const{data, status}= await http.get(`Project/getTaskDetail?taskId=${taskId}`);
      return data.content;
  }
)
export const getTaskTypeApi= createAsyncThunk("ProjectReducer/getTaskTypeApi",
  async()=>{
    const {data, status}=await http.get(`TaskType/getAll`);
    return data.content;
  }
)

export const getStatusApi=createAsyncThunk("ProjectReducer/getStatusApi",
  async()=>{
    const {data,status}= await http.get('status/getAll');
    return data.content;
  }
)



export const getPriorityApi= createAsyncThunk("ProjectReducer/getPriorityApi",
  async()=>{
    const{data,status}= await http.get('Priority/getAll');
    return data.content;
  }
)

export const updateDscTask= createAsyncThunk("ProjectReducer/updateDscTask",
  async(content:any,{dispatch})=>{
    console.log(content)
    const{data, status}= await http.put(`Project/updateDescription`, content);
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId))
    }
  }
)

export const updateStatusApi=createAsyncThunk("ProjectReducer/updateStatusApi",
  async(content:any,{dispatch})=>{
    const{data, status}= await http.put(`Project/updateStatus`,content);
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId));
      dispatch(getProjectDetailApi(content.projectId))
    }
  }
)

export const updateStatusDnDApi=createAsyncThunk("ProjectReducer/updateStatusApi",
async(content:any,{dispatch})=>{
  dispatch(setLoading(true));
  console.log(content)
  const{data, status}= await http.put(`Project/updateStatus`,content);
  console.log(data)
  if(status===STATUS_CODE.SUCCESS){
    await dispatch(getProjectDetailApi(content.projectId))
    dispatch(setLoading(false));    
  }
  else {
    dispatch(setLoading(false));
  }
}
)

export const removeUserFromTaskApi=createAsyncThunk("ProjectReducer/removeUserFromTaskApi",
  async(content:any,{dispatch})=>{
    const{data, status}= await http.post(`Project/removeUserFromTask`,content);
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId));
      dispatch(getProjectDetailApi(content.projectId))
    }
  }
)

export const assignUserTaskApi=createAsyncThunk("ProjectReducer/assignUserTaskApi",
  async(content:any,{dispatch, getState})=>{
    const state: RootState = getState() as RootState;
    let taskDetail:any= {...state.ProjectReducer.taskDetail};
    const {projectDetail}=state.ProjectReducer;
    let listUserAsign:any[]=[...taskDetail.assigness,content]
    console.log(listUserAsign)
    listUserAsign= listUserAsign.map((user, index)=>{
      return user.id ||user.userId;
    })
    const taskUpdate={...taskDetail, listUserAsign}
    const{data,status}= await http.post(`Project/updateTask`,taskUpdate);
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(taskDetail.taskId));
      dispatch(getProjectDetailApi(Number(projectDetail?.id))); 
    }
  }
)

export const updatePriorityApi=createAsyncThunk("ProjectReducer/updatePriorityApi",
  async(content:any,{dispatch})=>{
    const {data, status}= await http.put(`Project/updatePriority`,content );
    if(status===STATUS_CODE.SUCCESS){
        dispatch(getTaskDetail(content.taskId));
    }
  }
)

export const updateOriginalEstimateApi= createAsyncThunk("ProjectReducer/updateOriginalEstimate",
  async(content:any,{getState, dispatch})=>{
    const{data, status}= await http.put(`Project/updateEstimate`, content)
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId))
    }
    console.log(data)
  }
) 

export const updateTimeTrackingApi=createAsyncThunk("ProjectReducer/updateTimeTrackingApi",
  async (content:any,{dispatch})=>{
    const {data, status}= await http.put(`Project/updateTimeTracking`, content);
    console.log(data)
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getTaskDetail(content.taskId));
    }
  }
) 

export const createTaskApi= createAsyncThunk("ProjectReducer/createTaskApi",
  async(task:TaskCreateModel, {dispatch})=>{
    dispatch(setLoading(true))
    const {data, status}= await http.post(`Project/createTask`,task );
    if(status===STATUS_CODE.SUCCESS){
      await dispatch(getProjectDetailApi(task.projectId))
      await dispatch(setLoading(false));
      await openNotificationWithIcon("success",'Create success !');
    }
    else dispatch(setLoading(false));
  }
)

export const removeTaskApi=createAsyncThunk("ProjectReducer/removeTaskApi",
  async(taskId:number, {dispatch,getState})=>{
    const state:RootState= getState() as RootState;
    const {projectDetail}= state.ProjectReducer
    const {data, status}= await http.delete(`Project/removeTask?taskId=${taskId}`)
    if(status===STATUS_CODE.SUCCESS){
      await dispatch(getProjectDetailApi(Number(projectDetail?.id)))
      openNotificationWithIcon("success","Deleted success !")
    }
  }
)