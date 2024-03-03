import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import {
  assignUserTaskApi,
  getPriorityApi,
  getStatusApi,
  getTaskDetail,
  getTaskTypeApi,
  removeUserFromTaskApi,
  updateDscTask,
  updateOriginalEstimateApi,
  updatePriorityApi,
  updateStatusApi,
  updateTimeTrackingApi,
} from "../../redux/reducer/ProjectReducer";
import { Popconfirm, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import parse from "html-react-parser";
import {
  deleteCommentApi,
  insertCommentApi,
  updateCommentApi,
} from "../../redux/reducer/TaskCommentReducer";

type Props = {};

const Modal = (props: Props) => {
  const { taskDetail, arrStatus, taskType, projectDetail, arrPriority } =
    useSelector((state: RootState) => state.ProjectReducer);
  const { userLogin } = useSelector((state: RootState) => state.UserReducer);
  const dispatch: DispatchType = useDispatch();
  const [openDsc, setDsc] = useState<boolean>(false);
  const [dscContent, setDscContent] = useState<string>("");
  const [insertComment, setInsertComment] = useState<string>("");
  const [openEditCmt, setOpenEditCmt] = useState<any>({ id: 1, value: false });
  const [contentEditCmt, setContentEditCmt] = useState<string>("");
  const [originalEstimate, setOriginalEstimate] = useState<any>(
    taskDetail?.originalEstimate
  );
  const [timeTrackingSpentState, setTimeTrackingSpentState] = useState<any>(
    taskDetail?.timeTrackingSpent
  );
  const [timeTrackingRemainingState, setTimeTrackingRemainingState] =
    useState<any>(taskDetail?.timeTrackingRemaining);

  const renderTimeTracking = () => {
    const timeTrackingSpent = taskDetail?.timeTrackingSpent;
    const timeTrackingRemaining = taskDetail?.timeTrackingRemaining;
    const max = Number(timeTrackingSpent) + Number(timeTrackingRemaining);
    const percent = Math.round((Number(timeTrackingSpent) / max) * 100);
    return (
      <div>
        <div style={{ display: "flex" }}>
          <i className="fa fa-clock" />
          <div style={{ width: "100%" }}>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percent}%` }}
                aria-valuenow={timeTrackingSpent}
                aria-valuemin={0}
                aria-valuemax={max}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p className="logged">{timeTrackingSpent}h logged</p>
              <p className="estimate-time">
                {timeTrackingRemaining}h remaining
              </p>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-6">
            <input
              type="number"
              name="timeTrackingSpent"
              className="form-control"
              min={0}
              value={
                timeTrackingSpentState !== undefined
                  ? timeTrackingSpentState
                  : taskDetail?.timeTrackingSpent || ""
              }
              onChange={(e) => {
                setTimeTrackingSpentState(e.target.value);
                if (e.target.value !== "") {
                  dispatch(
                    updateTimeTrackingApi({
                      taskId: taskDetail?.taskId,
                      timeTrackingSpent: e.target.value,
                      timeTrackingRemaining: taskDetail?.timeTrackingRemaining,
                    })
                  );
                }
              }}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              name="timeTrackingRemaining"
              className="form-control"
              value={
                timeTrackingRemainingState !== undefined
                  ? timeTrackingRemainingState
                  : taskDetail?.timeTrackingRemaining || ""
              }
              onChange={(e) => {
                setTimeTrackingRemainingState(e.target.value);
                if (e.target.value !== "") {
                  dispatch(
                    updateTimeTrackingApi({
                      taskId: taskDetail?.taskId,
                      timeTrackingSpent: taskDetail?.timeTrackingSpent,
                      timeTrackingRemaining: e.target.value,
                    })
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleEditorChange = (content: string) => {
    setDscContent(content);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatch(
        insertCommentApi({
          taskId: taskDetail?.taskId,
          contentComment: insertComment,
        })
      );
      setInsertComment("");
    }
  };

  useEffect(() => {
    dispatch(getTaskTypeApi());
    dispatch(getStatusApi());
    dispatch(getPriorityApi());
  }, []);
  return (
    <div
      className="modal fade"
      id="infoModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="infoModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-info">
        <div className="modal-content">
          <div className="modal-header">
            <div className="task-title">
              <i className="fa fa-bookmark " style={{ color: "#5fb03e" }} />
              <span>{taskDetail?.taskName}</span>
              <select
                name="typeId"
                value={taskDetail?.typeId}
                className="form-control"
                onChange={() => {}}
              >
                {taskType.map((tp, index) => {
                  return (
                    <option key={index} value={tp.id}>
                      {tp.taskType}1
                    </option>
                  );
                })}
              </select>
            </div>
            <div style={{ display: "flex" }} className="task-click">
              <div>
                <i className="fab fa-telegram-plane" />
                <span style={{ paddingRight: 20 }}>Give feedback</span>
              </div>
              <div>
                <i className="fa fa-link" />
                <span style={{ paddingRight: 20 }}>Copy link</span>
              </div>
              <i
                className="fa fa-trash-alt='xyz'"
                style={{ cursor: "pointer" }}
              />
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row d-flex">
                <div className="col-8">
                  <p className="issue">This is an issue of type: Task.</p>
                  <div
                    className="description"
                    onClick={() => {
                      setDsc(!openDsc);
                    }}
                  >
                    <h6 style={{ fontWeight: 600 }}>Description</h6>
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 10 }}>
                    {openDsc ? (
                      <div>
                        <Editor
                          apiKey="mqxr2os4qhejuo4m3hwy7ze5uegr1yixwfk0zu4j2kekhitj"
                          init={{
                            plugins:
                              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                          }}
                          initialValue={taskDetail?.description}
                          onEditorChange={handleEditorChange}
                        />
                        <button
                          className="btn btn-success mr-2 mt-2"
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            setDsc(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary mt-2"
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            dispatch(
                              updateDscTask({
                                taskId: taskDetail?.taskId,
                                description: dscContent,
                              })
                            );
                            setDsc(false);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => {
                          setDsc(!openDsc);
                        }}
                      >
                        {" "}
                        {parse(`${taskDetail?.description}`)}
                      </span>
                    )}
                  </div>
                  <div className="comment">
                    <h6 style={{ fontWeight: 600 }}>Comment</h6>
                    <div className="block-comment" style={{ display: "flex" }}>
                      <div className="avatar d-flex">
                        <img src={userLogin.avatar} alt="xyz" />
                      </div>
                      <div
                        className="input-comment"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="text"
                          placeholder="Add a comment ..."
                          className="form-control w-100"
                          value={insertComment}
                          onChange={(e) => {
                            setInsertComment(e.target.value);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </div>
                    <div className="lastest-comment">
                      {taskDetail?.lstComment.map((cmt, index) => {
                        return (
                          <div className="comment-item pt-3" key={index}>
                            <div
                              className="display-comment"
                              style={{ display: "flex" }}
                            >
                              <div className="avatar">
                                <img src={cmt.avatar} alt="xyz" />
                              </div>
                              <div className="w-100">
                                <p style={{ marginBottom: 5 }}>
                                  Lord Gaben <span>a month ago</span>
                                </p>
                                {openEditCmt.id === cmt.id &&
                                openEditCmt.value ? (
                                  <input
                                    className="w-100 form-control"
                                    style={{ height: 40, padding: 10 }}
                                    defaultValue={cmt.commentContent}
                                    onChange={(e) => {
                                      setContentEditCmt(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                      console.log(e.key);
                                      if (e.key === "Enter") {
                                        dispatch(
                                          updateCommentApi({
                                            id: cmt.id,
                                            content: contentEditCmt,
                                            taskId: taskDetail.taskId,
                                          })
                                        );
                                        setOpenEditCmt({ value: false });
                                      }
                                    }}
                                  />
                                ) : (
                                  cmt.commentContent
                                )}
                                <div>
                                  <span
                                    style={{
                                      color: "#929398",
                                      fontSize: 15,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setOpenEditCmt({
                                        id: cmt.id,
                                        value: true,
                                      });
                                    }}
                                  >
                                    Edit
                                  </span>
                                  <Popconfirm
                                    placement="topLeft"
                                    title={"Are you sure to delete comment ? "}
                                    onConfirm={() => {
                                      dispatch(
                                        deleteCommentApi({
                                          idComment: cmt.id,
                                          taskId: taskDetail.taskId,
                                        })
                                      );
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <span
                                      style={{
                                        color: "#929398",
                                        fontSize: 15,
                                        marginLeft: 10,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Delete
                                    </span>
                                  </Popconfirm>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-4 ">
                  <div className="status">
                    <h6>STATUS</h6>
                    <select
                      className="custom-select"
                      name="statusId"
                      value={taskDetail?.statusId}
                      onChange={(e) => {
                        dispatch(
                          updateStatusApi({
                            taskId: taskDetail?.taskId,
                            statusId: e.target.value,
                            projectId: projectDetail?.id,
                          })
                        );
                      }}
                    >
                      {arrStatus.map((item, index) => {
                        return (
                          <option key={index} value={item.statusId}>
                            {item.statusName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="assignees">
                    <h6>ASSIGNEES</h6>
                    <div className="row ml-1">
                      {taskDetail?.assigness?.map((user, index) => {
                        return (
                          <div
                            className="col-12 mt-1"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignSelf: "center",
                              lineHeight: "50%",
                            }}
                            key={index}
                          >
                            <div className="item row ">
                              <div className="avatar col-3">
                                <img src={user.avatar} alt="xyz" />
                              </div>
                              <div
                                className="name mt-1 col-9"
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    alignItems: "center",
                                    marginBottom: 0,
                                    marginTop: 0,
                                  }}
                                >
                                  {user.name}
                                </p>
                                <i
                                  className="fa-solid fa-xmark "
                                  style={{
                                    marginTop: 5,
                                    marginLeft: 7,
                                    cursor: "pointer",
                                    alignSelf: "right",
                                  }}
                                  onClick={() => {
                                    dispatch(
                                      removeUserFromTaskApi({
                                        taskId: taskDetail.taskId,
                                        userId: user.id,
                                        projectId: projectDetail?.id,
                                      })
                                    );
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row mt-3 ml-1 mb-4">
                      <Select
                        options={projectDetail?.members
                          ?.filter((mem) => {
                            const index = taskDetail?.assigness?.findIndex(
                              (us) => us.id == mem.userId
                            );
                            if (index === -1) {
                              return true;
                            }
                            return false;
                          })
                          .map((mem, index) => {
                            return { value: mem.userId, label: mem.name };
                          })}
                        style={{ width: 200 }}
                        value="+ Add more"
                        placeholder="Select a person"
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(value) => {
                          let userSelected = projectDetail?.members.find(
                            (mem: any) => mem.userId === value
                          );
                          dispatch(assignUserTaskApi(userSelected));
                        }}
                      ></Select>
                      ,
                    </div>
                  </div>

                  <div className="priority" style={{ marginBottom: 20 }}>
                    <h6>PRIORITY</h6>
                    <select
                      value={taskDetail?.priorityTask?.priorityId}
                      className="form-control"
                      onChange={(e) => {
                        dispatch(
                          updatePriorityApi({
                            taskId: taskDetail?.taskId,
                            priorityId: e.target.value,
                          })
                        );
                      }}
                    >
                      {arrPriority.map((item, index) => {
                        return (
                          <option key={index} value={item.priorityId}>
                            {item.priority}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="estimate">
                    <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                    <input
                      type="text"
                      name="originalEstimate"
                      className="estimate-hours"
                      // defaultValue={taskDetail?.originalEstimate}
                      value={
                        originalEstimate !== undefined
                          ? originalEstimate
                          : taskDetail?.originalEstimate || ""
                      }
                      onChange={(e) => {
                        setOriginalEstimate(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          dispatch(
                            updateOriginalEstimateApi({
                              taskId: taskDetail?.taskId,
                              originalEstimate: originalEstimate,
                            })
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="time-tracking">
                    <h6>TIME TRACKING</h6>
                    {renderTimeTracking()}
                  </div>
                  <div style={{ color: "#929398" }}>Create at a month ago</div>
                  <div style={{ color: "#929398" }}>
                    Update at a few seconds ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
