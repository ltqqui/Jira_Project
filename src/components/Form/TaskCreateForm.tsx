import { PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Slider, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { ProjectUpdateModel, TaskCreateModel, createTaskApi, getProjectDetailApi } from '../../redux/reducer/ProjectReducer';
import { useParams } from 'react-router-dom';
import { setCallFunction, setVisible } from '../../redux/reducer/DrawerJiraReducer';
type Props = {}
const { Option } = Select;
const TaskCreateForm = (props: Props) => {
  const {projectCategory}= useSelector((state:RootState)=>state.ProjectCategoryReducer);
  const {projectDetail, arrPriority, taskType, arrStatus}= useSelector((state:RootState)=> state.ProjectReducer);
const [timeTracking, setTimeTracking] = useState({
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0
})
  const userOptions = projectDetail?.members?.map((item, index) => {
    return { value: item.userId, label: item.name };
})
const a= useParams()
console.log(a)
  const dispatch:DispatchType =useDispatch();
  const frm= useFormik<TaskCreateModel>({
    enableReinitialize:true,
    initialValues:{
        listUserAsign:[],
        taskName:'',
        description:'',
        statusId:'1',
        originalEstimate:0,
        timeTrackingSpent:0,
        timeTrackingRemaining:0,
        projectId:projectDetail?.id||0,
        typeId:1,
        priorityId:1
    },
    onSubmit:(values:TaskCreateModel)=>{  
      dispatch(createTaskApi(values))
      dispatch(setVisible(false));
    }
  })
  const handleEditorChange = (content:any) => {
    frm.setFieldValue('description', content);
}
  useEffect(()=>{
    dispatch(setCallFunction(frm.handleSubmit))
  },[])
  return (
    <form className='container'>
    <div className='form-group'>
        <div className="row">
            <div className="col-12">
                <p>Task name</p>
                <input type="text" className='form-control' name='taskName' onChange={frm.handleChange} />
            </div>
        </div>
    </div>
    <div className='form-group'>
        <div className="row">
            <div className="col-12">
                <p>Status </p>
                <select name="statusId" className='form-control' onChange={frm.handleChange}  >
                    {arrStatus?.map((item, index) => {
                        return <option key={index} value={item.statusId}>{item.statusName}</option>
                    })}
                </select>
            </div>
        </div>
    </div>
    <div className="from-group">
        <div className="row">
            <div className="col-6">
                <p>Priority</p>
                <select name="priorityId" id="" className='form-control' onChange={frm.handleChange}  >
                    {arrPriority?.map((item, index) => {
                        return <option key={index} value={item.priorityId}>{item.priority}</option>
                    })}
                </select>
            </div>
            <div className="col-6">
                <p>Task type</p>
                <select name="typeId" id="" className='form-control' onChange={frm.handleChange}  >
                    {taskType?.map((item, index) => {
                        return <option key={index} value={item.id}>{item.taskType}</option>
                    })}
                </select>
            </div>
        </div>
    </div>

    <div className='form-group mt-3'>
        <div className="row">
            <div className="col-6">
                <p>Assignment</p>
                <Select
                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionFilterProp='label'
                    placeholder="Please select"
                    onChange={(values, option) => {
                        frm.setFieldValue('listUserAsign', values)
                    }}

                    options={userOptions}
                />
            </div>
            <div className='col-6'>
                <p>Time tracking</p>
                <Slider
                    max={Number(timeTracking.timeTrackingSpent) + Number(timeTracking.timeTrackingRemaining)}
                    value={timeTracking.timeTrackingSpent}
                />
            </div>
        </div>
    </div>
    <div className='form-group '>
        <div className="row">
            <div className="col-6">
                <p>Original Estimate</p>
                <input type="number " defaultValue='0' className='form-control' min='0' name='originalEstimate' onChange={frm.handleChange} />
            </div>
            <div className='col-6 row'>
                <div className='col-6'>
                    <p>Spent</p>
                    <input type="number" defaultValue='0' name='timeTrackingSpent' min='0' className='form-control' onChange={(e) => {
                        setTimeTracking({
                            ...timeTracking,
                            timeTrackingSpent: Number(e.target.value)
                        })
                        frm.setFieldValue('timeTrackingSpent', e.target.value)
                    }} />
                </div>
                <div className='col-6'>
                    <p>Remaining</p>
                    <input type="number" defaultValue='0' name='timeTrackingRemaining' min='0' className='form-control' onChange={(e) => {
                        setTimeTracking({
                            ...timeTracking,
                            timeTrackingRemaining: Number(e.target.value)
                        })
                        frm.setFieldValue('timeTrackingRemaining', e.target.value)
                    }} />
                </div>
            </div>
        </div>
    </div>
    <div className="form-group mt-3">
        <div className="row">
            <div className="col-12">
                <p>Description</p>
                <Editor 
             apiKey='mqxr2os4qhejuo4m3hwy7ze5uegr1yixwfk0zu4j2kekhitj'
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            initialValue="Welcome to TinyMCE!"
            onEditorChange={handleEditorChange}
          />
            </div>
        </div>
    </div>
</form>
  )
  }

export default TaskCreateForm