import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import {
  getProjectDetailApi,
  getTaskDetail,
  removeTaskApi,
  updateStatusDnDApi,
} from "../../redux/reducer/ProjectReducer";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal/ModalTask";
import parse from "html-react-parser";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { Button, Popconfirm } from "antd";
import {
  setComponent,
  setTitle,
  setVisible,
} from "../../redux/reducer/DrawerJiraReducer";
import TaskCreateForm from "../../components/Form/TaskCreateForm";
import { DeleteOutlined } from "@ant-design/icons";
type Props = {};

const ProjectDetail = (props: Props) => {
  const { projectDetail } = useSelector(
    (state: RootState) => state.ProjectReducer
  );
  const dispatch: DispatchType = useDispatch();
  const { id } = useParams();
  const renderMembers = () => {
    return projectDetail?.members?.map((member, index) => {
      return (
        <div key={index} className="avatar">
          <img src={member.avatar} alt="1" />
        </div>
      );
    });
  };

  const handleDragEnd = (result: any) => {
    const { projectId, taskId } = JSON.parse(result.draggableId);
    console.log(result);
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index !== source.index
    ) {
      let a = {
        ...projectDetail?.lstTask[source.droppableId - 1].lstTaskDeTail[
          source.index
        ],
      };
      let b = {
        ...projectDetail?.lstTask[destination.droppableId - 1].lstTaskDeTail[
          destination.index
        ],
      };
      let temp = a;
      a = b;
      b = temp;
      // dispatch()
    }
    dispatch(
      updateStatusDnDApi({
        taskId: taskId,
        statusId: destination.droppableId,
        projectId: projectId,
      })
    );
  };
  const renderCardTaskList = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        {projectDetail?.lstTask?.map((taskListDetail, index) => {
          return (
            <Droppable key={index} droppableId={taskListDetail.statusId}>
              {(provided: any) => {
                return (
                  <div
                    className="card pb-2"
                    style={{ width: "17rem", height: "auto" }}
                  >
                    <div className="card-header">
                      {taskListDetail.statusName}
                    </div>
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      key={index}
                      className="list-group list-group-flush"
                      style={{ height: "100%" }}
                    >
                      {taskListDetail.lstTaskDeTail.map((task, index) => {
                        return (
                          <Draggable
                            key={task.taskId.toString()}
                            index={index}
                            draggableId={JSON.stringify({
                              projectId: task.projectId,
                              taskId: task.taskId,
                            })}
                          >
                            {(provided: any) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="list-group-item mt-2"
                                  data-toggle="modal"
                                  data-target="#infoModal"
                                  onClick={() => {
                                    dispatch(getTaskDetail(task.taskId));
                                  }}
                                >
                                  <p className="font-weight-300">
                                    {task.taskName}
                                  </p>
                                  <div
                                    className="block"
                                    style={{ display: "flex" }}
                                  >
                                    <div className="block-left" style={{position:'relative'}}>
                                      <p className="" style={{color:'#70aae9'}}>
                                        {task.priorityTask.priority}
                                      </p>
                                      <Popconfirm
                                        title="Are you sure to delete this task?"
                                        onConfirm={() => {
                                          dispatch(removeTaskApi(task.taskId))
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                      >
                                        <DeleteOutlined 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                          style={{
                                            position:'absolute',
                                            fontSize: 18,
                                            bottom:-5,
                                            zIndex:150,
                                            color:'#dc3545',
                                          }}
                                        />
                                      </Popconfirm>
                                    </div>
                                    <div className="block-right">
                                      <div
                                        className="avatar-group"
                                        style={{ display: "flex" }}
                                      >
                                        {task.assigness.map((mem, index) => {
                                          return (
                                            <div className="avatar" key={index}>
                                              <img
                                                src={mem.avatar}
                                                alt={mem.avatar}
                                              />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                );
              }}
            </Droppable>
          );
        })}
      </DragDropContext>
    );
  };

  useEffect(() => {
    dispatch(getProjectDetailApi(Number(id)));
  }, []);
  return (
    <div className="main">
      <div className="header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ backgroundColor: "white" }}>
            <li className="breadcrumb-item">Project</li>
            <li className="breadcrumb-item">CyberLearn</li>
            <li className="breadcrumb-item active" aria-current="page">
              {projectDetail?.projectName}
            </li>
          </ol>
        </nav>
      </div>
      <h3>{projectDetail?.projectName}</h3>
      <span>{parse(`${projectDetail?.description}`)}</span>
      <div className="info" style={{ display: "flex" }}>
        <div className="search-block">
          <input className="search" />
          <i className="fa fa-search" />
        </div>
        <div className="avatar-group" style={{ display: "flex" }}>
          {renderMembers()}
        </div>
        <div className="text" style={{ marginLeft: "20px" }}>
          Only My Issues
        </div>
        <div className="text" style={{ marginLeft: "20px" }}>
          Recently Updated
        </div>
        <Button
          type="primary"
          style={{ marginLeft: "20px" }}
          onClick={() => {
            dispatch(setVisible(true));
            dispatch(setTitle("Create Task"));
            dispatch(setComponent(<TaskCreateForm />));
          }}
        >
          Create
        </Button>
      </div>
      <div className="contentTask  d-flex">{renderCardTaskList()}</div>
      <Modal />
    </div>
  );
};

export default ProjectDetail;
