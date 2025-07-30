import React, { useEffect, useState } from 'react'
import './AdminMenu.css'
import Table from 'react-bootstrap/Table';
import axios from "axios";
import swal from "sweetalert"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';



export default function AdminMenu() {

    const [menus, setMenus] = useState([])
    const [mainMenus, setMainMenus] = useState([])

    useEffect(() => {
        getAllMenus()
        getAllMainMenus()
    }, [])


    async function getAllMenus() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        await axios.get('http://localhost:4000/v1/menus/all', {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                setMenus(res.data);
            })
            .catch(err => {
                console.error('❌ خطا:', err.response?.data || err.message);
            });
    }

    async function getAllMainMenus() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));


        await axios.get('http://localhost:4000/v1/menus/mainmenu', {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                setMainMenus(res.data);
            })
            .catch(err => {
                console.error('❌ خطا:', err.response?.data || err.message);
            });
    }


    const initialValues = {
        title: '',
        href: '',
        parent: ''
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('نام دوره الزامی است'),
        href: Yup.string().required('توضیحات الزامی است'),
        parent: Yup.string().notRequired(),
    });


    const handleSubmit = async (values, { resetForm }) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        if (!values.parent) {
            delete values.parent;
        }

        try {
            await axios.post('http://localhost:4000/v1/menus', values, {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            swal("موفقیت‌آمیز!", "منو با موفقیت اضافه شد. ✅", "success");
            getAllMenus();
            resetForm();
        } catch (error) {
            console.error("❌ خطا در افزودن تخفیف:", error.response?.data || error.message);
            swal("خطا!", "در افزودن منو مشکلی پیش آمد. ❌", "error");
        }

    };

    const removeMenuHandler = (menuID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از حذف منو اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.delete(
                    `http://localhost:4000/v1/menus/${menuID}`,
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
                    title: "منو با موفقیت حذف شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllMenus()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    }

    return (
        <div className='AdminMenu'>


            <div className="form-container">
                <h2 className="form-title">افزودن دوره</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="form">

                        {/* کد تخفیف */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="title">کد تخفیف</label>
                            <Field type="text" name="title" id="title" placeholder="لطفاً نام دوره را وارد کنید ..." />
                            <ErrorMessage name="title" component="div" className="error" />
                        </div>

                        {/* درصد تخفیف */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="href">درصد تخفیف</label>
                            <Field type="text" name="href" id="href" placeholder="لطفاً نام دوره را وارد کنید ..." />
                            <ErrorMessage name="href" component="div" className="error" />
                        </div>


                        {/* دسته‌بندی دوره */}
                        <div className="form-group">
                            <label className='fs-3 mb-2' htmlFor="course">انتخاب دوره</label>
                            <Field as="select" name="parent" className="form-select">
                                <option value="">-- لطفاً دوره را انتخاب کنید --</option>
                                {mainMenus.map(menu => (
                                    <option key={menu._id} value={menu._id}>
                                        {menu.title}
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
                            <th>عنوان</th>
                            <th>آدرس</th>
                            <th>والد</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            menus.map((menu, index) => (
                                <tr>
                                    <td style={{ backgroundColor: menu.answer === 1 ? 'red' : 'transparent' }}>{index + 1}</td>
                                    <td>{menu.title}</td>
                                    <td>{menu.href}</td>
                                    <td>{menu.parent ? menu.parent.title : "Main Menu"}</td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeMenuHandler(menu._id)}>حذف</button>
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
