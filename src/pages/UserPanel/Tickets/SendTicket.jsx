import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import "./SendTicket.css";

export default function SendTicket() {
    const [departments, setDepartments] = useState([]);
    const [departmentsSubs, setDepartmentsSubs] = useState([]);
    const [courses, setCourses] = useState([]);

    const [departmentID, setDepartmentID] = useState('');
    const [ticketTypeID, setTicketTypeID] = useState('');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [body, setBody] = useState('');
    const [courseID, setCourseID] = useState('');
    const [files, setFiles] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
        fetchCourses();
    }, []);

    const fetchDepartments = async () => {
        const res = await fetch("http://localhost:4000/v1/tickets/departments");
        const data = await res.json();
        setDepartments(data);
    };

    const fetchCourses = async () => {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const res = await fetch("http://localhost:4000/v1/users/courses/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setCourses(data);
    };

    const getDepartmentsSub = async (id) => {
        const res = await fetch(`http://localhost:4000/v1/tickets/departments/${id}/subs`);
        const data = await res.json();
        setDepartmentsSubs(data);
    };

    const handleSendTicket = async (e) => {
        e.preventDefault();

        const token = JSON.parse(localStorage.getItem("user"))?.token;

        const formData = new FormData();
        formData.append("DepartmentID", departmentID);
        formData.append("DepartmentSubID", ticketTypeID);
        formData.append("title", title);
        formData.append("priority", priority);
        formData.append("body", body);
        if (courseID) formData.append("course", courseID);

        for (let i = 0; i < files.length; i++) {
            formData.append("covers", files[i]);
        }

        const res = await fetch("http://localhost:4000/v1/tickets", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (res.ok) {
            swal({
                title: "تیکت با موفقیت ارسال شد",
                icon: "success",
                buttons: "دمت گرم",
            }).then(() => {
                navigate("/my-account/tickets");
            });
        }
    };


    const handleFilesChange = (e) => {
        setFiles(e.target.files);
    };

    return (
        <div className="col-9">
            <div className="ticket">
                <div className="ticket-header">
                    <span className="ticket-header__title">ارسال تیکت جدید</span>
                    <a className="ticket-header__link" href="#">
                        همه تیکت‌ها
                    </a>
                </div>
                <form className="ticket-form">
                    <div className="row">

                        <div className="col-6">
                            <label className="ticket-form__label">دپارتمان را انتخاب کنید:</label>
                            <select
                                className="ticket-form__select"
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setDepartmentID(id);
                                    getDepartmentsSub(id);
                                }}
                            >
                                <option className="ticket-form__option">لطفا یک مورد را انتخاب نمایید.</option>
                                {departments.map((dep) => (
                                    <option key={dep._id} value={dep._id}>
                                        {dep.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6">
                            <label className="ticket-form__label">نوع تیکت را انتخاب کنید:</label>
                            <select
                                className="ticket-form__select"
                                onChange={(e) => setTicketTypeID(e.target.value)}
                            >
                                <option className="ticket-form__option">لطفا یک مورد را انتخاب نمایید.</option>
                                {departmentsSubs.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6">
                            <label className="ticket-form__label">عنوان تیکت را وارد کنید:</label>
                            <input
                                type="text"
                                className="ticket-form__input"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="col-6">
                            <label className="ticket-form__label">میزان اهمیت:</label>
                            <select
                                className="ticket-form__select"
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option className="ticket-form__option">میزان اهمیت تیکت را مشخص کنید :</option>
                                <option value="3">کم</option>
                                <option value="2">متوسط</option>
                                <option value="1">بالا</option>
                            </select>
                        </div>

                        {ticketTypeID === "63b688c5516a30a651e98156" && (
                            <div className="col-6">
                                <label className="ticket-form__label">دوره را انتخاب کنید:</label>
                                <select
                                    className="ticket-form__select"
                                    onChange={(e) => setCourseID(e.target.value)}
                                >
                                    <option className="ticket-form__option">لطفا یک مورد را انتخاب نمایید.</option>
                                    {courses.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.course?.name || "ارسال خراب از بک اند"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="col-12">
                            <label className="ticket-form__label">محتوای تیکت:</label>
                            <textarea
                                className="ticket-form__textarea"
                                onChange={(e) => setBody(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="col-12">
                            <div className="ticket-form__file">
                                <span className="ticket-form__file-max">حداکثر اندازه: 6 مگابایت</span>
                                <span className="ticket-form__file-format">
                                    فرمت‌های مجاز: jpg, png.jpeg, rar, zip
                                </span>
                                <input
                                    type="file"
                                    className="ticket-form__file-input"
                                    onChange={handleFilesChange}
                                    multiple
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <button className="ticket-form__btn" onClick={handleSendTicket}>
                                <i className="ticket-form__btn-icon fa fa-paper-plane"></i>
                                ارسال تیکت
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
