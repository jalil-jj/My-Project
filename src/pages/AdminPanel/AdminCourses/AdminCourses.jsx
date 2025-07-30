import React, { useEffect, useState } from 'react'
import './AdminCourses.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import swal from 'sweetalert';


export default function AdminCourses() {

    const [courses, setCourses] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getAllCourses()
        getAllCategiry()
    }, [])

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

    async function getAllCategiry() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));


        await axios.get('http://localhost:4000/v1/category', {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => {
                console.error('❌ خطا:', err.response?.data || err.message);
            });
    }


    const initialValues = {
        name: '',
        description: '',
        support: '',
        href: '',
        price: '',
        status: '',
        discount: '',
        categoryID: '',
        image: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('نام دوره الزامی است'),
        description: Yup.string().required('توضیحات الزامی است'),
        support: Yup.string().required('پشتیبانی الزامی است'),
        href: Yup.string().required('لینک الزامی است'),
        price: Yup.number().typeError('قیمت باید عدد باشد').required('قیمت الزامی است'),
        status: Yup.string().required('وضعیت الزامی است'),
        discount: Yup.number().typeError('تخفیف باید عدد باشد').required('تخفیف الزامی است'),
        categoryID: Yup.string().required('دسته‌بندی الزامی است'),
        image: Yup.mixed()
            .required('آپلود عکس الزامی است')
            .test('fileType', 'فرمت فایل فقط باید عکس باشد', (value) => {
                return value && ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
            }),
    });


    const handleSubmit = async (values, { resetForm }) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        const formData = new FormData();

        // image را جدا اضافه می‌کنیم
        if (values.image) {
            formData.append('cover', values.image); // توجه: کلید "cover" چون در سرور همین نام تعریف شده
        }

        // بقیه فیلدها رو اضافه می‌کنیم
        for (let key in values) {
            if (key !== 'image') {
                formData.append(key, values[key]);
            }
        }

        try {
            const response = await axios.post('http://localhost:4000/v1/courses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });

            console.log('✅ دوره با موفقیت ارسال شد:', response.data);

            // پاک کردن فرم پس از ارسال موفق
            resetForm();

            // به‌روزرسانی لیست دوره‌ها
            getAllCourses();

        } catch (error) {
            console.error('❌ خطا در ارسال دوره:', error.response?.data || error.message);
        }
    };


    const editHandler = (course) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: "ویرایش اطلاعات دوره",
            content: createCourseForm(course),
            buttons: ['انصراف', 'ذخیره']
        }).then((willSave) => {
            if (willSave) {
                const updatedCourse = {
                    name: document.getElementById('swal-course-name').value,
                    description: document.getElementById('swal-course-description').value,
                    support: document.getElementById('swal-course-support').value,
                    price: document.getElementById('swal-course-price').value,
                    discount: document.getElementById('swal-course-discount').value,
                    status: document.getElementById('swal-course-status').value,
                    href: document.getElementById('swal-course-href').value,
                    categoryID: document.getElementById('swal-course-categoryID').value
                };

                const formData = new FormData();
                Object.keys(updatedCourse).forEach(key => formData.append(key, updatedCourse[key]));

                const newCoverFile = document.getElementById('swal-course-cover').files[0];
                if (newCoverFile) {
                    formData.append("cover", newCoverFile);
                }

                axios.put(`http://localhost:4000/v1/courses/${course._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`,
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then(() => {
                        swal("دوره با موفقیت ویرایش شد", { icon: "success" });
                        getAllCourses();
                    })
                    .catch(err => {
                        console.error("❌ خطا:", err);
                        swal("خطا در ویرایش", err.response?.data?.message || err.message, "error");
                    });
            }
        });
    };


    function createCourseForm(course, categories = []) {
        const wrapper = document.createElement('div');



        wrapper.innerHTML = `
          <input id="swal-course-name" class="swal-content__input" placeholder="نام دوره" value="${course.name || ''}" />
          <input id="swal-course-description" class="swal-content__input" placeholder="توضیحات" value="${course.description || ''}" />
          <input id="swal-course-support" class="swal-content__input" placeholder="پشتیبانی" value="${course.support || ''}" />
          <input id="swal-course-price" type="number" step="0.01" class="swal-content__input" placeholder="قیمت" value="${course.price || ''}" />
          <input id="swal-course-discount" type="number" step="0.01" class="swal-content__input" placeholder="تخفیف" value="${course.discount || ''}" />
          <input id="swal-course-status" class="swal-content__input" placeholder="وضعیت (در حال برگزاری، کامل شده و...)" value="${course.status || ''}" />
          <input id="swal-course-href" class="swal-content__input" placeholder="لینک دوره" value="${course.href || ''}" />
          <input id="swal-course-category" class="swal-content__input" placeholder="دسته بندی دوره" value="${course.categoryID || ''}" />
          <label>کاور جدید (اختیاری):</label>
          <input id="swal-course-cover" class="swal-content__input" type="file" />
        `;
        return wrapper;
    }

    const removeHandler = (courseID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: "آیا از حذف دوره مطمعن هستید ؟",
            icon: "warning",
            buttons: ['خیر', 'بله'],
            dangerMode: true
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(`http://localhost:4000/v1/courses/${courseID}`, {
                        headers: {
                            Authorization: `Bearer ${localStorageData.token}`
                        }
                    })
                        .then(() => {
                            swal({
                                title: 'دوره با موفقیت حذف شد',
                                icon: "success",
                                button: 'اوکی'
                            });
                            getAllCourses();
                        })
                        .catch((err) => {
                            console.error('خطا در حذف کاربر:', err);
                            swal({
                                title: 'خطایی رخ داد',
                                text: err.response?.data?.message || err.message,
                                icon: "error",
                                button: 'باشه'
                            });
                        });
                }
            });
    }


    return (
        <div className='admin-courses'>
            <div className='wrapper'>

                <div className="form-container">
                    <h2 className="form-title">افزودن دوره</h2>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form className="form">

                            {/* نام دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="title">نام دوره</label>
                                <Field type="text" name="name" id="name" placeholder="لطفاً نام دوره را وارد کنید ..." />
                                <ErrorMessage name="name" component="div" className="error" />
                            </div>

                            {/* توضیحات دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="description">توضیحات دوره</label>
                                <Field type="text" name="description" id="description" placeholder="لطفاً توضیحات دوره را وارد کنید ..." />
                                <ErrorMessage name="description" component="div" className="error" />
                            </div>

                            {/* پشتیبانی دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="support">پشتیبانی دوره</label>
                                <Field type="text" name="support" id="support" placeholder="لطفاً پشتیبانی دوره را وارد کنید ..." />
                                <ErrorMessage name="support" component="div" className="error" />
                            </div>

                            {/* لینک دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="href">لینک دوره</label>
                                <Field type="text" name="href" id="href" placeholder="لطفاً لینک دوره را وارد کنید ..." />
                                <ErrorMessage name="href" component="div" className="error" />
                            </div>

                            {/* قیمت */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="price">قیمت</label>
                                <Field type="text" name="price" id="price" placeholder="لطفاً قیمت را وارد کنید ..." />
                                <ErrorMessage name="price" component="div" className="error" />
                            </div>

                            {/* وضعیت */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="status">وضعیت</label>
                                <Field type="text" name="status" id="status" placeholder="لطفاً وضعیت را وارد کنید ..." />
                                <ErrorMessage name="status" component="div" className="error" />
                            </div>

                            {/* تخفیف */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="discount">تخفیف</label>
                                <Field type="text" name="discount" id="discount" placeholder="لطفاً مقدار تخفیف را وارد کنید ..." />
                                <ErrorMessage name="discount" component="div" className="error" />
                            </div>

                            {/* دسته‌بندی دوره */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="category">دسته‌بندی دوره</label>

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

                            {/* لینک عکس محصول */}
                            <div className="form-group">
                                <label className='fs-3 mb-2' htmlFor="image">آپلود عکس محصول</label>
                                <Field name="image">
                                    {({ form }) => (
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={(event) => {
                                                form.setFieldValue("image", event.currentTarget.files[0]);
                                            }}
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="image" component="div" className="error" />
                            </div>

                            <button type="submit" className="submit-button">افزودن دوره</button>

                        </Form>
                    </Formik>

                </div>

            </div>

            <div className='table-container'>
                <div className='course-table-wrapper'>
                    <h2>لیست کاربران</h2>
                    <Table bordered hover className='table'>
                        <thead>
                            <tr>
                                <th>شناسه</th>
                                <th>عنوان</th>
                                <th>مبلغ</th>
                                <th>وضعیت</th>
                                <th>لینک</th>
                                <th>مدرس</th>
                                <th>ویرایش</th>
                                <th>حذف</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courses.map((course, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{course.name}</td>
                                        <td>{course.price}</td>
                                        <td>{course.status}</td>
                                        <td>{course.href}</td>
                                        <td>{course.creator}</td>
                                        <td>
                                            <button className='btn btn-info fs-5' onClick={() => editHandler(course)}>ویرایش</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-danger fs-5' onClick={() => removeHandler(course._id)}>حذف</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>

        </div>
    )
}
