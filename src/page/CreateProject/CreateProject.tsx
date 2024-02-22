import { Button, Input, Select } from "antd";
import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DispatchType, RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { getProjectCategoryApi } from "../../redux/reducer/ProjectCategoryReducer";
import { useFormik } from "formik";
import { CreateProjectModel, createProjectApi } from "../../redux/reducer/ProjectReducer";
import axios from "axios";
import { DOMAIN } from "../../setting/config";
type Props = {};

const CreateProject = (props: Props) => {
  const editorRef = useRef<any>(null);
  const dispatch:DispatchType= useDispatch();
  const {projectCategory}= useSelector((state:RootState)=> state.ProjectCategoryReducer);
  const frm= useFormik<CreateProjectModel>({
    initialValues:{
      projectName:"",
      description:"",
      categoryId:1,
      alias:""
    },
    onSubmit:(values:any)=>{
      dispatch(createProjectApi(values))
    }

  })
  const options= projectCategory.map((item,index)=>{
    return {value:item.id, label:item.projectCategoryName}
  })
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };
  const handleEditorChange =(content:any, editor:any)=>{
    frm.setFieldValue('description',content)
  }
  const handleChangeSelect=(value:any)=>{
    frm.setFieldValue("categoryId",value)
  }
  useEffect(()=>{
    dispatch(getProjectCategoryApi());
  },[])
  return (
    <div className="createProject">
      <h2>CREATE PROJECT</h2>
      <form className="container" onSubmit={frm.handleSubmit}>
        <div className="projectName">
          <p>Project name</p>
          <Input onChange={frm.handleChange} name="projectName"/>
        </div>
        <div className="description">
          <p>Description</p>
          <Editor 
            apiKey="mqxr2os4qhejuo4m3hwy7ze5uegr1yixwfk0zu4j2kekhitj"
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
        <div className="category">
          <p>Category</p>
          <Select
            size={"middle"}
            defaultValue={1}
            onChange={handleChangeSelect}
            style={{ width: "100% "}}
            options={options}
          />
        </div>
        <Button onClick={frm.submitForm} type="primary">Submit</Button>
      </form>
    </div>
  );
};

export default CreateProject;
