import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider } from 'react-redux'
import { unstable_HistoryRouter as HistoryBrowser, Route,Routes } from 'react-router-dom';
import { store } from './redux/configStore';
import { history } from './utils/lib/lib';
import  './assets/scss/style.scss'
import ProjectManagement from './page/ProjectManagement/ProjectManagement';
import HomeTemplate from './template/HomeTemplate/HomeTemplate';
import UserTemplate from './template/UserTemplate/UserTemplate';
import LoginAndRegister from './page/LoginAndRegister/LoginAndRegister';
import Loading from './components/Loading/Loading';
import CreateProject from './page/CreateProject/CreateProject';

import Test from './page/Test';
import DrawerJira from './HOC/DrawerJira';
import ProjectDetail from './page/ProjectDetail/ProjectDetail';
import UserManagement from './page/UserMangement/UserManagement';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store} >
    <Loading/>
    <DrawerJira/> 
    <HistoryBrowser history={history}>
        <Routes>
        <Route path='' element={<HomeTemplate/>}>
          <Route index element={<ProjectManagement/>}></Route>
          <Route path='projectManagement' element={<ProjectManagement/>}></Route>
          <Route path='createProject' element={<CreateProject/>}></Route>
          <Route path='projectDetail'>
            <Route path=":id" element={<ProjectDetail/>}></Route>
          </Route>
          <Route path='userManagement' element={<UserManagement/>}></Route>
        </Route>
        <Route path='' element={<UserTemplate/>}>
          <Route path='register' element={<LoginAndRegister/>}></Route>
          <Route path='login' element={<LoginAndRegister/>}></Route>
        </Route>
        </Routes>
    </HistoryBrowser>
  </Provider>
);
reportWebVitals();
