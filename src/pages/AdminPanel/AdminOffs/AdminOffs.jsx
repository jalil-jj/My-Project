import React, { useEffect, useState } from 'react'
import './AdminOffs.css'
import Table from 'react-bootstrap/Table';
import axios from "axios";
import swal from "sweetalert"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


export default function AdminOffs() {

    const [offs, setOffs] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getAllOffs()
        getAllCourses()
    }, [])


    async function getAllOffs() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const res = await axios.get('http://localhost:4000/v1/offs', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                },
            });

            setOffs(res.data);
        } catch (error) {
            console.error('خطا در دریافت کامنت‌ها:', error);
        }
    }

    async function getAllCourses() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));


        await axios.get('http://localhost:4000/v1/courses', {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => {
                console.error('❌ خطا:', err.response?.data || err.message);
            });
    }


    const initialValues = {
        code: '',
        percent: '',
        max: '',
        course: '',
    };

    const validationSchema = Yup.object({
        code: Yup.string().required('نام دوره الزامی است'),
        percent: Yup.string().required('توضیحات الزامی است'),
        max: Yup.string().required('پشتیبانی الزامی است'),
        course: Yup.string().required('دسته‌بندی الزامی است')
    });


    const handleSubmit = async (values, { resetForm }) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            await axios.post('http://localhost:4000/v1/offs', values, {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            swal("موفقیت‌آمیز!", "تخفیف با موفقیت اضافه شد. ✅", "success");
            getAllOffs();
            resetForm();
        } catch (error) {
            console.error("❌ خطا در افزودن تخفیف:", error.response?.data || error.message);
            swal("خطا!", "در افزودن تخفیف مشکلی پیش آمد. ❌", "error");
        }

    };


    const removeOffHandler = (offID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از حذف تخفیف اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.delete(
                    `http://localhost:4000/v1/offs/${offID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorageData.token}`
                        }
                    }
                );
            } else {
                throw new Error("Canceled by user");
            }
        })
            .then(() => {
                swal({
                    title: "تخفیف با موفقیت حذف شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllOffs()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    }


    return (
        <div className='AdminOffs'>


            <div className="form-container">
                <h2 className="form-title">افزودن دوره</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="form">

                        {/* کد تخفیف */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="code">کد تخفیف</label>
                            <Field type="text" name="code" id="code" placeholder="لطفاً نام دوره را وارد کنید ..." />
                            <ErrorMessage name="code" component="div" className="error" />
                        </div>

                        {/* درصد تخفیف */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="percent">درصد تخفیف</label>
                            <Field type="text" name="percent" id="percent" placeholder="لطفاً نام دوره را وارد کنید ..." />
                            <ErrorMessage name="percent" component="div" className="error" />
                        </div>

                        {/* حداکثر استفاده */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="max">حداکثر استفاده از تخفیف</label>
                            <Field type="text" name="max" id="max" placeholder="لطفاً نام دوره را وارد کنید ..." />
                            <ErrorMessage name="max" component="div" className="error" />
                        </div>


                        {/* دسته‌بندی دوره */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="course">انتخاب دوره</label>
                            <Field as="select" name="course" className="form-select">
                                <option value="">-- لطفاً دوره را انتخاب کنید --</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="course" component="div" className="error" />
                        </div>



                        <button type="submit" className="submit-button">افزودن دوره</button>

                    </Form>
                </Formik>

            </div>


            <div className='table-wrapper'>
                <h2>کامنت ها</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>کد</th>
                            <th>درصد</th>
                            <th>حداکثر استفاده</th>
                            <th>تعداد استفاده</th>
                            <th>دوره</th>
                            <th>سازنده</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            offs.map((off, index) => (
                                <tr>
                                    <td style={{ backgroundColor: off.max === off.user ? 'red' : 'transparent' }}>{index + 1}</td>
                                    <td>{off?.code}</td>
                                    <td>{off?.percent}</td>
                                    <td>{off?.max}</td>
                                    <td>{off?.user}</td>
                                    <td>{off?.course?.name}</td>
                                    <td>{off?.creator?.name}</td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeOffHandler(off._id)}>حذف</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
