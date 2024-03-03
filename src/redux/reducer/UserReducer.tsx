import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ACCESS_TOKEN,
  DOMAIN,
  STATUS_CODE,
  USER_LOGIN,
  http,
  settings,
} from "../../setting/config";
import _, { result } from "lodash";
import { setLoading } from "./LoadingReducer";
import { history } from "../../utils/lib/lib";
import axios from "axios";
import { openNotificationWithIcon } from "../../utils/lib/Nontification";
import { getAllProjectApi, getUserApi } from "./ProjectReducer";
import { RootState } from "../configStore";

export type UserRegisterModel = {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string;
};
export type UserLoginModel = {
  email: string;
  passWord: string;
};
export type UserLoginResult = {
  id: number;
  email: string;
  avatar: string;
  phoneNumber: string;
  name: string;
  accessToken: string;
};

export type UserByProjectId={
  userId:number;
  name:string;
  avatar:string;
  email:string;
  phoneNumber:string;
}

export type UserModel={
  userId:number;
  name:string;
  avatar:string;
  email:string;
  phoneNumber:string;
}

export type UserState = {
  userRegister: UserRegisterModel | {};
  userLogin: UserLoginResult;
  arrUser:UserModel[];
  userDetail:UserModel
}

const initialState: UserState = {
  userRegister: {},
  userLogin: settings.getStorageJson(USER_LOGIN)
  ? settings.getStorageJson(USER_LOGIN)
  : {},
  arrUser:[],
  userDetail:{
    userId:123,
    name:'lam',
    phoneNumber:'1234568',
    avatar:'abc',
    email:"lamt@gmail.com"
  }
}; 

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
  },
  extraReducers:(builder) =>{
    builder.addCase(postUserLogin.fulfilled,(state:UserState, action:PayloadAction<UserLoginResult>)=>{
        state.userLogin=action.payload;
        if(action.payload){
          settings.setStorageJson(USER_LOGIN, state.userLogin);
        settings.setStorage(ACCESS_TOKEN, state.userLogin.accessToken);
        }
        console.log(action.payload)
    })
    builder.addCase(getAllUserApi.fulfilled,(state:UserState, action:PayloadAction<UserModel[]>)=>{
      state.arrUser=action.payload;
    })
    builder.addCase(getUserDetailApi.fulfilled,(state:UserState, action:PayloadAction<UserModel>)=>{
      state.userDetail=action.payload;
    })
  }
});

export const {} = UserReducer.actions;

export default UserReducer.reducer;

export const postUserRegister = createAsyncThunk(
  "UserReducer/postRegister",
  async (userRegister: UserRegisterModel) => {
    const infoRegister = _.omit(userRegister, ["confirmPassword"]);
    const { data, status } = await http.post("Users/signup", infoRegister);
    return data.content;
  }
);


export const postUserLogin = createAsyncThunk("UserReducer/testLogin",
  async (userLogin: UserLoginModel, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const result = await axios({
        url: `${DOMAIN}/Users/signin`,
        method: "POST",
        data: userLogin
      });
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setLoading(false));
        history.push("/projectManagement");
      }

      dispatch(setLoading(false))
      return result.data.content;
    } catch (error) {
      openNotificationWithIcon("error","Email hoặc mật khẩu không đúng !");
      dispatch(setLoading(false));
    }
  }
);

export const getAllUserApi= createAsyncThunk("UserReducer/getAllUserApi",
  async(content:string,{dispatch})=>{
    if(content===""){
      dispatch(setLoading(true));
      const {data, status}=await http.get("Users/getUser");
      if(status===STATUS_CODE.SUCCESS){
        dispatch(setLoading(false));
      }
      else dispatch(setLoading(false));
      return data.content;
    }
    else{
      const {data, status}=await http.get(`Users/getUser?keyword=${content}`);
      return data.content;
      
    }
  }
)

export const getUserDetailApi=createAsyncThunk("UserReducer/getUserDetailApi",
  async(content:string)=>{
    const{data, status}= await http.get(`Users/getUser?keyword=${content}`);
    return data.content[0];
  }
)

export const updateUserApi= createAsyncThunk("UserReducer/updateUserApi",
  async(content:any,{dispatch})=>{
    const{data, status}= await http.put("Users/editUser",content)
    if(status===STATUS_CODE.SUCCESS){
      dispatch(getAllUserApi(""));
      await openNotificationWithIcon("success", "Update success !");
    }
  }
)

  
  

