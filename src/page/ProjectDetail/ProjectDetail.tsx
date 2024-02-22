import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";

type Props = {};

const ProjectDetail = (props: Props) => {
    const {projectDetail}= useSelector((state:RootState)=> state.ProjectReducer);
    // const renderMembers=()=>{
    //     return projectDetail.members?.map((member,index)=>{
    //         return   <div key={index} className="avatar">
    //         <img src={member.avatar} alt='1' />
    //     </div>
    //     })
    // }
  return (
    <div>
      <div className="header">
        <nav aria-label="breadcrumb">
            <span>Project/ list/ abc </span>
        </nav>
      </div>
      <div>
        <h3>abc</h3>
        <div className="info" style={{ display: "flex" }}>
          <div className="search-block">
            <input className="search" />
            <i className="fa fa-search" />
          </div>
          <div className="avatar-group" style={{ display: "flex" }}>
            <div className="avatar">
                        {/* <img src={projectDetail?.members.} alt='1' /> */}
                    </div>
                    {/* <div className="avatar">
                        <img src={require('../../../assets/img/download (2).jfif')} alt='2' />
                    </div>
                    <div className="avatar">
                        <img src={require('../../../assets/img/download (3).jfif')} alt='3' />
                    </div> */}
            {/* {renderMembers()} */}
          </div>
          <div style={{ marginLeft: 20 }} className="text">
            Only My Issues
          </div>
          <div style={{ marginLeft: 20 }} className="text">
            Recently Updated
          </div>
        </div>
      </div>
      <div className="content" style={{ display: "flex" }}></div>
    </div>
  );
};

export default ProjectDetail;
