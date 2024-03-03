import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { getProjectCategoryApi } from '../../redux/reducer/ProjectCategoryReducer';
import { ProjectUpdateModel, getProjectDetailApi, updateProjectApi } from '../../redux/reducer/ProjectReducer';
import { setCallFunction, setVisible } from '../../redux/reducer/DrawerJiraReducer';
import { UserModel, getUserDetailApi, updateUserApi } from '../../redux/reducer/UserReducer';

type Props = {
}
const { Option } = Select;
const UserEdit: React.FC<Props> = (props:Props ) => {
  const{userDetail}= useSelector((state:RootState)=>state.UserReducer);
  const dispatch:DispatchType =useDispatch();
  const frm= useFormik({
    enableReinitialize:true,
    initialValues:{
      id:userDetail?.userId.toString(),
      name:userDetail?.name,
      email:userDetail?.email,
      avatar:userDetail?.avatar,
      phoneNumber:userDetail?.phoneNumber,
      passWord:null 
    },
    onSubmit:(values)=>{  
      dispatch(updateUserApi(values))
      dispatch(setVisible(false));
    }
  })
  useEffect(()=>{
    dispatch(setCallFunction(frm.handleSubmit))
  },[])
  return (
    <form className='userEdit' onSubmit={frm.handleSubmit}>
    <div className="contentTop">
        <div className="userId">
            <p className='text-weight-bol'>ID</p>
            <input type="text" value={frm.values.id} className='form-control' name='userId' disabled={true} />
        </div>
        <div className="name">
            <p className='text-weight-bold'>Name</p>
            <input type="text" onChange={frm.handleChange} value={frm.values.name} className='form-control' name='name' />
        </div>
        <div className="email">
            <p className='text-weight-bold'>Email</p>
            <input type="text" onChange={frm.handleChange} value={frm.values.email} className='form-control' name='email' />
        </div>
        <div className="phoneNumber">
            <p className='text-weight-bold'>Phone</p>
            <input type="text" onChange={frm.handleChange} value={frm.values.phoneNumber} className='form-control' name='phoneNumber' />
        </div>
    </div>
</form>
)
}

export default UserEdit