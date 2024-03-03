
import React, { useEffect, useRef, useState } from 'react'
import { MemberModel, assignUserProject, deleteProjectApi, getAllProjectApi, getProjectDetailApi, getUserApi, removeUserProjectApi } from '../../redux/reducer/ProjectReducer'
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import type { TableProps } from 'antd';
import { AutoComplete, Avatar, Button, Popconfirm, Popover, Space, Table, Tag } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { setComponent, setTitle, setVisible } from '../../redux/reducer/DrawerJiraReducer';
import ProjectEdit from '../../components/Form/ProjectEdit';
import ReactDOMServer from 'react-dom/server';
import { getAllUserApi, getUserDetailApi } from '../../redux/reducer/UserReducer';
import UserEdit from '../../components/Form/UserEdit';


type DataType= {
  userId:number;
  name:string;
  avatar:string;
  email:string;
  phoneNumber:string;
}

type Props = {
}

const UserManagement = (props: Props) => {
  const dispatch:DispatchType= useDispatch();
  const {arrUser}=useSelector((state:RootState)=> state.UserReducer);
  const [user, setUser]= useState<string>();
  const searchUserRef=useRef<any>(null);
  const searchProjectRef= useRef<any>(null);
  const data: DataType[] = arrUser.map((item, index)=>{
    return {
      userId:item.userId,
      name:item.name,
      avatar:item.avatar,
      email:item.email,
      phoneNumber:item.phoneNumber
    }
  })
  const columns: ColumnsType<DataType> = [
    {
      title:'Id',
      dataIndex:'userId',
      key:'userId'
    },
    {
      title:'Name',
      key:'name',
      render:(text, record, index)=>{
        return <Tag color='green' key={index}>{record.name}</Tag>
      }
    },
    {
      title: 'Avatar',
      key: 'avatar',
      render: (text, record, index) => {
        return <Avatar src={text.avatar} key={index} />
      }
    },
    {
      title: 'Email',
      key: 'email',
      render: (text, record, index) => {
        return <p>{record.email}</p>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Space size="middle" key={index}>
          <button style={{ borderRadius: '3px', outline: '#FFF', border: 'none', background:'#007bff', cursor:'pointer' }} ><EditOutlined style={{ color: '#fff', fontSize: 20, padding: 3 }} onClick={()=>{
            dispatch(setVisible(true));
            dispatch(setTitle("Edit user"));
            dispatch(setComponent(<UserEdit />))
            dispatch(getUserDetailApi(record.userId.toString()))
            }}/></button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={()=>{
              dispatch(deleteProjectApi(record.userId));
            }}
            okText="Yes"
            cancelText="No"
          >
            <button  style={{ borderRadius: '3px', border: 'none', background:'#dc3545', cursor:'pointer' }}><DeleteOutlined style={{ color: '#fff ', fontSize: 20, padding: 3 }}/></button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  useEffect(()=>{
    dispatch(getAllUserApi(""))
  },[])
  return (
    <div className='userManagement'>
          <h2>USER MANAGEMENT</h2>
          <Search placeholder="input search text" onChange={(e)=>{
            if(searchProjectRef.current){
              clearTimeout(searchProjectRef.current);
            }
            searchProjectRef.current = setTimeout(() => {
              dispatch(getAllUserApi(e.target.value))
            }, 1000)
          }} enterButton />
          <Table columns={columns} dataSource={data} rowKey={(record)=>{return record.userId}}  pagination={{
        pageSize: 8, 
      }} />
    </div>
  )
}

export default UserManagement