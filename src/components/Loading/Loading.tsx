import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'

type Props = {}

const Loading = (props: Props) => {
    const {isLoading}= useSelector((state:RootState)=> state.LoadingReducer)
  return (
    <div className={isLoading ? 'loading' :'hideLoading'}>
        <img src="/img/loading/loading.webp" alt="" />
    </div>
  )
}

export default Loading