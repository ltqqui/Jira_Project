import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Layout, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { RootState } from "../../redux/configStore";
import { ACCESS_TOKEN, USER_LOGIN } from "../../setting/config";
import { history } from "../../utils/lib/lib";
import Modal from "../../components/Modal/ModalTask";

const { Header, Sider, Content } = Layout;

const HomeTemplate: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [widthScreen, setWidthScreen] = useState<number>(300);
  const { userLogin } = useSelector((state: RootState) => state.UserReducer);
  const pagrams = useParams();
  const onCollapse = (collapsed: any) => {
    setCollapsed(collapsed);
  };
  useEffect(() => {
    window.onresize = () => {
      setWidthScreen(window.innerWidth);
    };
  }, []);
  return (
    <div className="homeTemplate">
      <Layout>
        <Sider collapsible collapsed={ collapsed} onCollapse={onCollapse}>
          <div
            className="logo"
            style={
              !collapsed
                ? {
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }
                : {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
            }
          >
            <img
              src="/img/logo/jira_icon.png"
              style={collapsed ? { width: "80%" } : { width: "30%" }}
              onClick={()=>{
                history.push("")
              }}
              alt=""
            />
            <span
              style={
                collapsed  ?
                 { display: "none"}
                  : { color: "white", width: "50%", fontSize: "17px", marginLeft:10 }
              }
            >
              Jira Software
            </span>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <ProjectOutlined />,
                label: "Project",
                children: [
                  {
                    key: "4",
                    label: (
                      <p style={{margin:0}}
                        onClick={() => {
                          history.push("/createProject");
                        }}
                      >
                        Create project
                      </p>
                    ),
                  },
                  {
                    key: "6",
                    label: (
                      <p style={{margin:0}}
                        onClick={() => {
                          history.push("/projectManagement");
                        }}
                      >
                        Project list
                      </p>
                    ),
                  },
                ],
              },
              {
                key: "2",
                icon: <UserOutlined onClick={() => {
                  history.push("/userManagement");
                }} />,
                label:  <p style={{margin:0}}
                onClick={() => {
                  history.push("/userManagement");
                }}
              >
                User
              </p>,
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <div>
            <div
              className="site-page-header-ghost-wrapper"
              style={{ margin: 0, marginTop: 10 }}
            >
              {userLogin?.id ? (
                <Header>
                  <div>
                    <Avatar
                      src={userLogin?.avatar}
                      style={{ width: 40, height: 40, marginRight: "10px" }}
                    />

                    <Button
                      key="3"
                      onClick={() => {
                        localStorage.removeItem(USER_LOGIN);
                        localStorage.removeItem(ACCESS_TOKEN);
                        window.location.reload();
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                </Header>
              ) : (
                <Header>
                  <div></div>
                  <div>
                    <Button key="3" type="primary" onClick={()=>{
                      history.push("/login")
                    }}>
                      Sign in
                    </Button>
                    <Button key="2" style={{marginLeft:5}} onClick={()=>{
                      history.push("/register")
                    }}>
                      Sign up
                    </Button>
                  </div>
                </Header>
              )}
            </div>
          </div>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default HomeTemplate;
