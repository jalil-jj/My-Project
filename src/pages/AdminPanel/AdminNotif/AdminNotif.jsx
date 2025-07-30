import React, { useEffect, useState } from 'react'
import './AdminNotif.css'
import Table from 'react-bootstrap/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';

export default function AdminNotif() {


    const [notifs , setNotifs] = useState([])

    useEffect(() => {
       getAllNotif()
    },[])


    async function getAllNotif() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/notification', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setNotifs(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }


    const initialValues = {
        message: '',
        admin: ''
    };

    const validationSchema = Yup.object({
        message: Yup.string().required('وارد کردن پیغام الزامی است'),
        admin: Yup.string().required('وارد کردن نام ادمین الزامی است'),
    });

    const handleSubmit = (values, { resetForm }) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        axios.post('http://localhost:4000/v1/notification', values, {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                swal({
                    title: 'پیغام با موفقیت ارسال شد.',
                    icon: 'success',
                    button: 'باشه'
                });
                getAllNotif();
                resetForm();
            })
            .catch(err => {
                console.error(err);
                swal({
                    title: 'خطا در ارسال پیغام ',
                    icon: 'error',
                    button: 'باشه'
                });
            });
    };

    const removeNotifHandler = (notifID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: 'آیا از حذف نوتفیکیشن مطمئن هستید؟',
            icon: 'warning',
            buttons: ['خیر', 'بلی']
        }).then((userChoice) => {
            if (userChoice) {
                axios.delete(`http://localhost:4000/v1/notification/${notifID}/delete`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then((res) => {
                        swal({
                            title: 'نوتفیکیشن با موفقیت حذف شد.',
                            icon: 'success',
                            button: 'باشه'
                        });
                        getAllNotif()
                    })
                    .catch((err) => {
                        console.error(err);
                        swal({
                            title: 'خطا در حذف نوتفیکیشن',
                            icon: 'error',
                            button: 'باشه'
                        });
                    });
            }
        });
    }

  return (
    <div className='AdminNotif'>
         <div className='wrapper'>
                <div className="form-container">
                    <h2 className="form-title">پیغام جدید</h2>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form className="form">

                            {/* نام دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="message">متن پیغام</label>
                                <Field type="text" name="message" id="message" placeholder="لطفاً نام دوره را وارد کنید ..." />
                                <ErrorMessage name="message" component="div" className="error" />
                            </div>

                            {/* توضیحات دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="admin">اسم ادمین</label>
                                <Field type="text" name="admin" id="admin" placeholder="لطفاً توضیحات دوره را وارد کنید ..." />
                                <ErrorMessage name="admin" component="div" className="error" />
                            </div>
                            <button type="submit" className="submit-button">افزودن دوره</button>
                        </Form>
                    </Formik>

                    <div className='table-wrapper'>
                        <h2>لیست دسته بندی ها</h2>

                        <Table bordered hover className='table'>
                            <thead>
                                <tr>
                                    <th>شناسه</th>
                                    <th>پیغام</th>
                                    <th>اسم ادمین</th>
                                    <th>تاریخ</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    notifs.map((notif , index) => (
                                        <tr>
                                            <td style={{ backgroundColor: notif?.seen === 1 ? 'lightgreen' : 'transparent' }}>{index + 1}</td>
                                            <td>{notif.message}</td>
                                            <td>{notif.admin?.name}</td>
                                            <td>{notif.createdAt.split('T')[0]}</td>
                                            <td>
                                                <button className='btn btn-danger fs-4' onClick={()=>removeNotifHandler(notif._id)}>حدف</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
    </div>
  )
}
