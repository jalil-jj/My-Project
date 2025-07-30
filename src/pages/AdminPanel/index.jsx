import React from 'react'
import { Outlet } from 'react-router-dom';
import Topbar from './AdminTopbar/AdminTopbar'
import Sidebar from './AdminSidebar/Sidebar';
import './AdminIndex.css'

export default function index() {
  return (

    <div>
      <Topbar />

      <div className='wrapper'>
          <Sidebar />
          <Outlet/>
      </div>
    </div>
 
  )
}
