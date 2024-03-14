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
type Props = {}
const { Option } = Select;
const ProjectEdit:React.FC = (props: Props) => {
  const {projectCategory}= useSelector((state:RootState)=>state.ProjectCategoryReducer);
  const {projectDetail}= useSelector((state:RootState)=> state.ProjectReducer);
  console.log(projectDetail)
  const dispatch:DispatchType =useDispatch();
  const frm= useFormik({
    enableReinitialize:true,
    initialValues:{
      id:projectDetail?.id||0,
      projectName:projectDetail?.projectName||"",
      categoryId:projectDetail?.projectCategory.id||0,
      description:projectDetail?.description||''
    },
    onSubmit:(values:ProjectUpdateModel)=>{  
      dispatch(updateProjectApi(values))
      dispatch(setVisible(false))
    }
  })
  const handleEditorChange = (content:any) => {
    frm.setFieldValue('description', content);
}
  useEffect(()=>{
    dispatch(getProjectCategoryApi());
    dispatch(setCallFunction(frm.handleSubmit))
  },[])
  return (
    <form className='projectEdit' onSubmit={frm.handleSubmit}>
    <div className="contentTop">
        <div className="projectID">
            <p className=''>ID</p>
            <input type="text" value={frm.values.id} className='form-control' name='id' disabled={true} />
        </div>
        <div className="projectName">
            <p className='text-weight-bold'>Project Name</p>
            <input type="text" onChange={frm.handleChange} value={frm.values.projectName} className='form-control' name='projectName' />
        </div>
        <div className="categoryId">
            <p className='text-weight-bold'>Category Id</p>
            <select name="categoryId" id="" value={frm.values.categoryId} onChange={frm.handleChange} className='form-control' >
                {projectCategory.map((item, index) => {
                    return <option key={index} value={item.id}>{item.projectCategoryName}</option>
                })}
            </select>
        </div>
    </div>
    <div className="contentBottom">
    <Editor
             apiKey='mqxr2os4qhejuo4m3hwy7ze5uegr1yixwfk0zu4j2kekhitj'
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            initialValue="Welcome to TinyMCE!"
            value={frm.values.description}
            onEditorChange={handleEditorChange}
          />
        </div>
</form>
)
}

export default ProjectEdit