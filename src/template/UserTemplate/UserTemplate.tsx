import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const UserTemplate = (props: Props) => {
  return (
    <div className='userTemplate'>
        <Outlet/>
    </div>
  )
}

export default UserTemplate