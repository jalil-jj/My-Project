import React, { useEffect, useState } from 'react'
import './AdminSessions.css'
import Table from 'react-bootstrap/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';

export default function AdminSessions() {

    const [sessions, setSessions] = useState([])
    const [courses, setCourses] = useState([])
    const [selectedCourseId, setSelectedCourseId] = useState('')

    useEffect(() => {
        getAllSessions()
        getAllCourses()
    }, [])


    console.log(sessions);


    async function getAllSessions() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/courses/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setSessions(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }

    async function getAllCourses() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/courses', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setCourses(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }


    const initialValues = {
        title: '',
        time: '',
        free: '',
        video: null,
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('وارد کردن نام الزامی است'),
        time: Yup.string().required('وارد کردن زمان الزامی است'),
        free: Yup.number().required('وارد کردن وضعیت پولی الزامی است'),
        video: Yup.mixed().required('آپلود ویدیو الزامی است'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        if (!selectedCourseId) {
            swal('لطفا یک دوره انتخاب کنید', '', 'warning');
            return;
        }

        const localStorageData = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('time', values.time);
        formData.append('free', values.free);
        formData.append('video', values.video);

        try {
            await axios.post(`http://localhost:4000/v1/courses/${selectedCourseId}/session`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            swal('قسمت با موفقیت اضافه شد.', '', 'success');
            resetForm();
            setSelectedCourseId('');
            getAllSessions();
        } catch (err) {
            console.error(err);
            swal('خطا در افزودن قسمت', '', 'error');
        }
    };



    const removeSessionHandler = async (sessionId) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: 'آیا از حذف قسمت مطمئن هستید؟',
            icon: 'warning',
            buttons: ['خیر', 'بلی']
        }).then((userChoice) => {
            if (userChoice) {
                axios.delete(`http://localhost:4000/v1/courses/sessions/${sessionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then((res) => {
                        swal({
                            title: 'قسمت با موفقیت حذف شد.',
                            icon: 'success',
                            button: 'باشه'
                        });
                        getAllSessions()
                    })
                    .catch((err) => {
                        console.error(err);
                        swal({
                            title: 'خطا در حذف قسمت',
                            icon: 'error',
                            button: 'باشه'
                        });
                    });
            }
        });
    }


    return (
        <div className='AdminSessions'>
            <div className='wrapper'>
                <div className="form-container">
                    <h2 className="form-title">افزودن قسمت جدید</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form className="form">

                                {/* نام قسمت */}
                                <div className="form-group">
                                    <label className='fs-3 mb-2' htmlFor="title">نام قسمت</label>
                                    <Field type="text" name="title" id="title" placeholder="لطفاً نام قسمت را وارد کنید ..." />
                                    <ErrorMessage name="title" component="div" className="error" />
                                </div>

                                {/* تایم قسمت */}
                                <div className="form-group">
                                    <label className='fs-3 mb-2' htmlFor="time">تایم قسمت</label>
                                    <Field type="text" name="time" id="time" placeholder="لطفاً تایم قسمت را وارد کنید ..." />
                                    <ErrorMessage name="time" component="div" className="error" />
                                </div>

                                {/* وضعیت پولی */}
                                <div className="form-group">
                                    <label className='fs-3 mb-2' htmlFor="free">وضعیت پولی قسمت</label>
                                    <Field type="text" name="free" id="free" placeholder="رایگان یا پولی" />
                                    <ErrorMessage name="free" component="div" className="error" />
                                </div>

                                {/* انتخاب دوره */}
                                <div className="form-group">
                                    <label className='fs-3 mb-2' htmlFor="courseSelect">انتخاب دوره</label>
                                    <select
                                        id="courseSelect"
                                        className="form-select"
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                    >
                                        <option value="">-- لطفاً دوره را انتخاب کنید --</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* آپلود ویدیو */}
                                <div className="form-group">
                                    <label htmlFor="video">آپلود ویدیو</label>
                                    <input
                                        id="video"
                                        name="video"
                                        type="file"
                                        accept="video/*"
                                        onChange={(event) => {
                                            setFieldValue('video', event.currentTarget.files[0]);
                                        }}
                                    />
                                    <ErrorMessage name="video" component="div" className="error" />
                                </div>

                                <button type="submit" className="submit-button">افزودن قسمت</button>
                            </Form>
                        )}
                    </Formik>

                    <div className='table-wrapper'>
                        <h2>لیست قسمت‌ها</h2>

                        <Table bordered hover className='table'>
                            <thead>
                                <tr>
                                    <th>ردیف</th>
                                    <th>عنوان قسمت</th>
                                    <th>عنوان دوره</th>
                                    <th>تایم</th>
                                    <th>وضعیت پولی</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session, index) => (
                                    <tr key={session._id}>
                                        <td>{index + 1}</td>
                                        <td>{session.title}</td>
                                        <td>{session.course?.name}</td>
                                        <td>{session.time}</td>
                                        <td>{session.free === 0 ? 'رایگان' : session.free}</td>
                                        <td>
                                            <button
                                                className='btn btn-danger fs-5'
                                                onClick={() => removeSessionHandler(session._id)}
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                </div>
            </div>
        </div>
    );
}
