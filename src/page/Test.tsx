import React from 'react'
import { DispatchType } from '../redux/configStore'
import { useDispatch } from 'react-redux'
// import { testLogin } from '../redux/reducer/UserReducer'

type Props = {}

const Test = (props: Props) => {
    const dispatch:DispatchType= useDispatch();
  return (
    <div>
        test 
        <button onClick={()=>{
            // dispatch(testLogin())
        }}>Click</button>
    </div>
  )
}

export default Test