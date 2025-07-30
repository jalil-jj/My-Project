import React, { useEffect, useState } from 'react'
import './AdminCategory.css'
import Table from 'react-bootstrap/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';


export default function AdminCategory() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategory()
    }, [])

    async function getAllCategory() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/category', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setCategories(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }

    const initialValues = {
        title: '',
        href: ''
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('وارد کردن نام الزامی است'),
        href: Yup.string().required('وارد کردن آدرس الزامی است'),
    });

    const handleSubmit = (values, { resetForm }) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        axios.post('http://localhost:4000/v1/category', values, {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                swal({
                    title: 'دسته‌بندی با موفقیت اضافه شد.',
                    icon: 'success',
                    button: 'باشه'
                });
                getAllCategory();
                resetForm();
            })
            .catch(err => {
                console.error(err);
                swal({
                    title: 'خطا در افزودن دسته‌بندی',
                    icon: 'error',
                    button: 'باشه'
                });
            });
    };

    const removeCategoryHandler = (categoryID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: 'آیا از حذف دسته بندی مطمئن هستید؟',
            icon: 'warning',
            buttons: ['خیر', 'بلی']
        }).then((userChoice) => {
            if (userChoice) {
                axios.delete(`http://localhost:4000/v1/category/${categoryID}`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then((res) => {
                        swal({
                            title: 'دسته‌بندی با موفقیت حذف شد.',
                            icon: 'success',
                            button: 'باشه'
                        });
                        getAllCategory()
                    })
                    .catch((err) => {
                        console.error(err);
                        swal({
                            title: 'خطا در حذف دسته‌بندی',
                            icon: 'error',
                            button: 'باشه'
                        });
                    });
            }
        });
    };

    const editCategoryHandler = (category) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));
    
        swal({
            title: "ویرایش دسته‌بندی",
            content: createCategoryForm(category),
            buttons: ['انصراف', 'ذخیره']
        }).then((willSave) => {
            if (willSave) {
                const updatedCategory = {
                    title: document.getElementById('swal-category-title').value,
                    href: document.getElementById('swal-category-href').value,
                };
    
                axios.put(`http://localhost:4000/v1/category/${category._id}`, updatedCategory, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then(() => {
                        swal("دسته‌بندی با موفقیت ویرایش شد", { icon: "success" });
                        getAllCategory();
                    })
                    .catch(err => {
                        console.error("❌ خطا:", err);
                        swal("خطا در ویرایش", err.response?.data?.message || err.message, "error");
                    });
            }
        });
    }


    function createCategoryForm(category) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <input id="swal-category-title" class="swal-content__input" placeholder="نام دسته‌بندی" value="${category.title || ''}" />
            <input id="swal-category-href" class="swal-content__input" placeholder="آدرس دسته‌بندی" value="${category.href || ''}" />
        `;
        return wrapper;
    }
    


    return (
        <div className='adminCatrgory'>
            <div className='wrapper'>
                <div className="form-container">
                    <h2 className="form-title">افزودن دوره</h2>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form className="form">

                            {/* نام دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="title">نام دسته بندی</label>
                                <Field type="text" name="title" id="title" placeholder="لطفاً نام دوره را وارد کنید ..." />
                                <ErrorMessage name="title" component="div" className="error" />
                            </div>

                            {/* توضیحات دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="href">آدرس دسته بندی</label>
                                <Field type="text" name="href" id="href" placeholder="لطفاً توضیحات دوره را وارد کنید ..." />
                                <ErrorMessage name="href" component="div" className="error" />
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
                                    <th>نام دسته بندی</th>
                                    <th>آدرس</th>
                                    <th>ویرایش</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.map((category, index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{category.title}</td>
                                            <td>{category.href}</td>
                                            <td>
                                                <button className='btn btn-info fs-5' onClick={() => editCategoryHandler(category)}>ویرایش</button>
                                            </td>
                                            <td>
                                                <button className='btn btn-danger fs-5' onClick={() => removeCategoryHandler(category._id)}>حذف</button>
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
