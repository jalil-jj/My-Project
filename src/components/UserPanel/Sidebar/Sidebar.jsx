import React, { useContext } from "react";
import AuthContext from "../../../Contex/authContex";
import swal from 'sweetalert'
import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
    const authContex = useContext(AuthContext);
    const navigate = useNavigate();

    const exitHandler = (event) => {
        event.preventDefault();

        swal({
            title: 'آیا از خروج خود اطمینان دارید ؟',
            icon: 'warning',
            buttons: ['خیر', 'بلی']
        }).then(result => {
            if (result) {
                swal({
                    title: 'با موفقیت خروج کردید',
                    icon: 'success',
                    buttons: 'خدانگهدار'
                }).then(() => {
                    authContex.logout();
                    navigate('/');
                    window.location.reload();
                });
            }
        });
    };

    return (
        <div className="col-3">
            <div className="sidebar__user">
                <span className="sidebar__user__name">{authContex?.userInfos?.user?.name}</span>
                <ul>
                    <li className="sidebar__item">
                        <NavLink
                            to="/my-account"
                            end
                            className={({ isActive }) =>
                                isActive ? "sidebar__link active" : "sidebar__link"
                            }>
                            پیشخوان
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/my-account/orders"
                            className={({ isActive }) =>
                                isActive ? "sidebar__link active" : "sidebar__link"
                            }>
                            سفارش ها
                        </NavLink>
                    </li>
                    <li>
                        <a className="sidebar__link" href="#">
                            کیف پول من
                        </a>
                    </li>
                    <li>
                        <NavLink
                            to="/my-account/edits"
                            className={({ isActive }) =>
                                isActive ? "sidebar__link active" : "sidebar__link"
                            }>
                            جزئیات حساب کاربری
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/my-account/buyed"
                            className={({ isActive }) =>
                                isActive ? "sidebar__link active" : "sidebar__link"
                            }>
                            دوره های خریداری شده
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/my-account/tickets"
                            className={({ isActive }) =>
                                isActive ? "sidebar__link active" : "sidebar__link"
                            }>
                            تیکت های پشتیبانی
                        </NavLink>
                    </li>
                    <li onClick={exitHandler}>
                        <a className="sidebar__link" href="#">
                            خروج از سیستم
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
