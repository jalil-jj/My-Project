import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './AdminArticles.css';
import axios from "axios";
import TextEditor from './../../../components/AdminPanel/TextEditor/TextEditor';
import Swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';
import swal from "sweetalert";


export default function AdminArticles() {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([])

    useEffect(() => {
        getAllCategory();
        getAllArticles();
    }, []);

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.token;
    };

    async function getAllCategory() {
        try {
            const res = await axios.get('http://localhost:4000/v1/category', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setCategories(res.data);
        } catch (err) {
            console.error('❌ خطا در دریافت دسته‌بندی:', err.response?.data || err.message);
        }
    }

    async function getAllArticles() {
        try {
            const res = await axios.get('http://localhost:4000/v1/article', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setArticles(res.data);
        } catch (err) {
            console.error('❌ خطا در دریافت دسته‌بندی:', err.response?.data || err.message);
        }
    }

    console.log("getAllArticles", articles);

    const initialValues = {
        title: "",
        description: "",
        body: "",
        href: "",
        categoryID: "",
        image: [],
    };


    const validationSchema = Yup.object({
        title: Yup.string().required("عنوان اول الزامی است"),
        description: Yup.string().required("توضیح اول الزامی است"),
        body: Yup.string().required(" نوشتن متن الزامی است"),
        href: Yup.string().required("لینک الزامی است"),
        categoryID: Yup.string().required("دسته‌بندی الزامی است"),
        image: Yup.mixed().required("تصویر الزامی است"),
    });


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("href", values.href);
        formData.append("description", values.description);
        formData.append("body", values.body);
        formData.append("categoryID", values.categoryID);

        for (let i = 0; i < values.image.length; i++) {
            formData.append("covers", values.image[i]);
        }

        try {
            const res = await axios.post("http://localhost:4000/v1/article", formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "مقاله با موفقیت ثبت شد",
                showConfirmButton: false,
                timer: 2000,
            });

            resetForm();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "خطا در ارسال مقاله",
                text: err.response?.data?.message || err.message,
            });
        } finally {
            setSubmitting(false);
        }
        console.log(values);
    };

    const removeArticleHandler = (articleID) => {

        const localStorageData = JSON.parse(localStorage.getItem("user"))

        swal({
            title: 'آیا از حذف مقاله مطمئن هستید؟',
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(isAccept => {
            if (isAccept) {
                axios.delete(`http://localhost:4000/v1/article/${articleID}`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then(res => {
                        swal({
                            title: "مقاله با موفقیت حذف شد.",
                            icon: "success",
                            button: "اوکی"
                        });
                        getAllArticles()
                    })
                    .catch((err) => {
                        console.log("rrrrr", err);
                        swal({
                            title: "عملیات حذف با خطا رو‌به‌رو شد.",
                            icon: "error",
                            button: "اوکی"
                        });
                    });
            }
        });
    };


    return (
        <div className="AdminArticles container mt-5">
            <h2 className="mb-4">ساخت مقاله جدید</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="form">
                        <div className="row">

                            <div className="col-6 mt-4">
                                <label className='fs-3 mb-2' htmlFor="title">نام مقاله</label>
                                <Field type="text" name="title" id="title" placeholder="نام مقاله را وارد کنید ..." />
                                <ErrorMessage name="title" component="div" className="error" />
                            </div>

                            <div className="col-6 mt-4">
                                <label className='fs-3 mb-2' htmlFor="description">توضیحات مقاله</label>
                                <Field type="text" name="description" id="description" placeholder="توضیحات را وارد کنید ..." />
                                <ErrorMessage name="description" component="div" className="error" />
                            </div>

                            <div className="col-6 mt-4">
                                <label className='fs-3 mb-2' htmlFor="href">آدرس مقاله</label>
                                <Field type="text" name="href" id="href" placeholder="آدرس مقاله را وارد کنید ..." />
                                <ErrorMessage name="href" component="div" className="error" />
                            </div>

                            <div className="col-6 mt-4">
                                <label className='fs-3 mb-2' htmlFor="image">آپلود کاور مقاله (حداکثر ۵ عدد)</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    multiple
                                    onChange={(event) => {
                                        setFieldValue("image", event.currentTarget.files);
                                    }}
                                />
                                <ErrorMessage name="image" component="div" className="error" />
                            </div>

                            <div className="col-6 mt-4">
                                <label className='fs-3 mb-2' htmlFor="categoryID">دسته‌بندی مقاله</label>
                                <Field as="select" name="categoryID" id="categoryID">
                                    <option value="">لطفاً انتخاب کنید</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="categoryID" component="div" className="error" />
                            </div>

                            {/* <div>

                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="title1">عنوان ۱</label>
                                    <Field type="text" name="title1" id="title1" placeholder="عنوان اول را وارد کنید ..." />
                                    <ErrorMessage name="title1" component="div" className="error" />
                                </div>
                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="description1">توضیح ۱</label>
                                    <Field as="textarea" type="text" name="description1" id="description1" placeholder="توضیح اول را وارد کنید ..." />
                                    <ErrorMessage name="description1" component="div" className="error" />
                                </div>

                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="title2">عنوان ۲</label>
                                    <Field type="text" name="title2" id="title2" placeholder="عنوان دوم (اختیاری)" />
                                    <ErrorMessage name="title2" component="div" className="error" />
                                </div>

                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="description2">توضیح ۲</label>
                                    <Field as="textarea" type="text" name="description2" id="description2" placeholder="توضیح دوم (اختیاری)" />
                                    <ErrorMessage name="description2" component="div" className="error" />
                                </div>

                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="title3">عنوان ۳</label>
                                    <Field type="text" name="title3" id="title3" placeholder="عنوان سوم (اختیاری)" />
                                    <ErrorMessage name="title3" component="div" className="error" />
                                </div>

                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="description3">توضیح ۳</label>
                                    <Field as="textarea" type="text" name="description3" id="description3" placeholder="توضیح سوم (اختیاری)" />
                                    <ErrorMessage name="description3" component="div" className="error" />
                                </div>
                            </div> */}

                            <div>
                                <div className="mt-4">
                                    <label className='fs-3 mb-2' htmlFor="body">متن مقاله</label>
                                    <TextEditor
                                        value={values.body}
                                        onChange={(data) => setFieldValue("body", data)}
                                    />
                                    <ErrorMessage name="body" component="div" className="error" />
                                </div>
                            </div>




                            <div className="col-12 submit-button-wrapper d-flex justify-content-center mt-4">
                                <button type="submit" className="submit-button w-50">افزودن مقاله</button>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>


            <div className='table-wrapper'>
                <h2>لیست مقالات</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>عنوان مقاله</th>
                            <th>سازنده</th>
                            <th>دسته بندی</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            articles.map((article, index) => (
                                <tr key={article._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{article?.title}</td>
                                    <td>{article?.creator?.name}</td>
                                    <td>{article?.categoryID?.title}</td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeArticleHandler(article._id)}>حذف</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
