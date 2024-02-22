import React, { useEffect, useState } from 'react'
import { Button, Drawer, Space } from 'antd';
import { DispatchType, RootState } from '../redux/configStore';
import { useDispatch, useSelector } from 'react-redux';
import { setVisible } from '../redux/reducer/DrawerJiraReducer';
import ProjectEdit from '../components/Form/ProjectEdit';
type Props = {}

const DrawerJira = (props: Props) => {
  const {visible, title, component, callFunction}= useSelector((state:RootState)=> state.DrawerJiraReducer);
  const disapatch:DispatchType= useDispatch();
  const [widthScreen, setWidthScreen] = useState<number>(300);
  const onClose = () => {
    disapatch(setVisible(false))
  };
  window.onresize = () => {
    setWidthScreen(window.innerWidth);
  };
  return (
    <Drawer title={title} placement="right" width={window.innerWidth >=900 ? "40%" : window.innerWidth>=750 ? "60%" : "85%"  }  onClose={onClose} open={visible ? true : false}>
        {component}
        <div style={{textAlign:'right'}}>
          <Space style={{position:'absolute', bottom:20, right:20}}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={callFunction}>
            Submit
          </Button>
        </Space>
        </div>
      </Drawer>
  )
}

export default DrawerJira