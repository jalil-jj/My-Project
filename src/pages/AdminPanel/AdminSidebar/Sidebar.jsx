import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className='sidebar__admin'>
            <div>
                <ul>
                    <li>
                        <NavLink to='/p-admin/users' className={({ isActive }) => isActive ? 'active' : ''}>
                            کاربران
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/comments' className={({ isActive }) => isActive ? 'active' : ''}>
                            کامنت ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/courses' className={({ isActive }) => isActive ? 'active' : ''}>
                            دوره ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/article' className={({ isActive }) => isActive ? 'active' : ''}>
                            مقاله ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/session' className={({ isActive }) => isActive ? 'active' : ''}>
                            قسمت ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/category' className={({ isActive }) => isActive ? 'active' : ''}>
                            دسته بندی ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/contact' className={({ isActive }) => isActive ? 'active' : ''}>
                            ارتباط با ما
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/newsLetter' className={({ isActive }) => isActive ? 'active' : ''}>
                            ایمیل های عضو در خبرنامه
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/notif' className={({ isActive }) => isActive ? 'active' : ''}>
                            نوتیفیکیشن ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/off' className={({ isActive }) => isActive ? 'active' : ''}>
                            تخفیف ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/ticket' className={({ isActive }) => isActive ? 'active' : ''}>
                            تیکت ها
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/p-admin/menu' className={({ isActive }) => isActive ? 'active' : ''}>
                            منو ها
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}
