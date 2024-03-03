
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


type DataType= {
  id:number;
  members:MemberModel[];
  projectName:string;
  categoryName:string;
  creatorName:string;
}

type Props = {}

const ProjectManagement = (props: Props) => {
  const dispatch:DispatchType= useDispatch();
  const {projectList} = useSelector((state:RootState)=> state.ProjectReducer);
  const {listUser}= useSelector((state:RootState)=> state.ProjectReducer);
  const [user, setUser]= useState<string>();
  const searchUserRef=useRef<any>(null);
  const searchProjectRef= useRef<any>(null);
  
  const data: DataType[] = projectList.map((item, index)=>{
    return {
    id:item.id,
    members:item.members,
    projectName:item.projectName,
    categoryName:item.categoryName,
    creatorName:item.creator.name
    }
  })
  const columns: ColumnsType<DataType> = [
    {
      title:'Id',
      dataIndex:'id',
      key:'id'
    },
    {
      title:'Project name',
      key:'projectName',
      render:(text, record, index)=>{
        return <NavLink to={`/projectDetail/${record.id}`} key={index}>{record.projectName}</NavLink>
      }
    },
    {
      title:'Category name',
      dataIndex:'categoryName',
      key:'categoryName'
    },
    {
      title:'Creator',
      key:'creatorName',
      render:(text, record, index)=>{
        return <Tag color='green' key={index}>{record.creatorName}</Tag>
      }
    },
    {
      title:'Members',
      key:'members',
      render:(text, record , index)=>{
        return <div key={index}>
        {record.members?.slice(0, 3).map((member, index) => {
          return (
            <Popover key={index} title='Members' placement='top' content={() => {
              return <table className='userTable '>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Avatar</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {record.members?.map((member, index) => {
                    return <tr key={index}>
                      <td>{member?.userId}</td>
                      <td>{member?.name}</td>
                      <td><img src={member.avatar} alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} /></td>
                      <td><Button style={{background:'#ff4d4f', color:'#fff', fontWeight:200, border:'none'}} onClick={() => {
                        dispatch(removeUserProjectApi({projectId: record.id, userId:member.userId}))
                      }}>Delete</Button></td>
                    </tr>
                  })}
                </tbody>
              </table>
            }}>
              <Avatar key={index} src={member.avatar} />
            </Popover>
          )
        })}
        {record.members.length > 3 ? <Avatar>...</Avatar> : ''}
        <Popover placement="rightTop" title={'Add members'} content={() => {
          return <AutoComplete
            options={listUser?.map((user, index) => {
              return { label: user.name, value: user.userId.toString() }
            })}
            value={user}
            onChange={(text:string)=>{
              setUser(text)
            }}
            onSelect={(selectValue, option) => {
              setUser(option.label);
              dispatch(assignUserProject({projectId: record.id, userId:selectValue}))
            }}
            placeholder="input here"
            onSearch={(value:string)=>{
                if(searchUserRef.current){
                  clearTimeout(searchUserRef.current)
                }
                searchUserRef.current= setTimeout(()=>{
                  dispatch(getUserApi(value))
                },1000)
            }}
          />
        }} trigger="click">
          <Button style={{ borderRadius: '50%' }}>+</Button>
        </Popover>
      </div>
        
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Space size="middle" key={index}>
          <button style={{ borderRadius: '3px', outline: '#FFF', border: 'none', background:'#007bff', cursor:'pointer' }} ><EditOutlined style={{ color: '#fff', fontSize: 20, padding: 3 }} onClick={()=>{
            dispatch(setVisible(true));
            dispatch(setTitle("Edit Project"));
            dispatch(setComponent(<ProjectEdit/>))
            dispatch(getProjectDetailApi(record.id))
            }}/></button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={()=>{
              dispatch(deleteProjectApi(record.id));
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
    dispatch(getAllProjectApi(""));
  },[])
  return (
    <div className='projectManagement'>
          <h2>PROJECT MANAGEMENT</h2>
          <Search placeholder="input search text" onChange={(e)=>{
            if(searchProjectRef.current){
              clearTimeout(searchProjectRef.current);
            }
            searchProjectRef.current = setTimeout(() => {
              dispatch(getAllProjectApi(e.target.value))
              console.log(123)
            }, 1000)
          }} enterButton />
          <Table columns={columns} dataSource={data} rowKey={(record)=>{return record.id}}  pagination={{
        pageSize: 8, 
      }} />
    </div>
  )
}

export default ProjectManagement