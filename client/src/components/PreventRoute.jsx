import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PreventRoute = () => {
    const {currentUser} = useSelector((state)=>state.user)
   
  return  currentUser ? <Outlet /> : <Navigate to={'/log-in'} />
}

export default PreventRoute