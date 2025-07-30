import React from 'react'
import './Index.css'

import Topbar from '../../components/Topbar/Topbar'

import Sidebar from '../../components/UserPanel/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'


export default function index() {
    return (
        <div className='user__panel'>
            {/* <Topbar /> */}

            <section class="content">
                <div class="content-header">
                    <div class="container">
                        <span class="content-header__title">حساب کاربری من</span>
                    </div>
                </div>
                <div class="content-main">
                    <div class="container">
                        <div class="row">
                            <Sidebar />

                            <Outlet />

                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
