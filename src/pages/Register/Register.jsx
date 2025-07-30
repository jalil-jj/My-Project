import React, { useContext } from "react";
import './Register.css';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import axios from "axios";
import AuthContext from './../../Contex/authContex';
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
    name: Yup.string()
        .required("نام الزامی است")
        .min(8, "نام باید حداقل 8 کاراکتر داشته باشد")
        .max(20, "نام باید کمتر از 20 کاراکتر باشد"),

    username: Yup.string()
        .required("نام کاربری الزامی است")
        .min(8, "نام کاربری باید حداقل 8 کاراکتر داشته باشد")
        .max(20, "نام کاربری باید کمتر از 20 کاراکتر باشد"),

    email: Yup.string()
        .email("فرمت ایمیل معتبر نیست")
        .required("ایمیل الزامی است")
        .min(8, "ایمیل باید حداقل 8 کاراکتر داشته باشد")
        .max(20, "ایمیل باید کمتر از 20 کاراکتر باشد"),

    phone: Yup.string()
        .matches(/^09\d{9}$/, "شماره تلفن معتبر نیست")
        .required("شماره تماس الزامی است")
        .max(11, "شماره تماس باید حداکثر 11 کاراکتر باشد"),

    password: Yup.string()
        .required("رمز عبور الزامی است")
        .min(8, "رمز عبور حداقل باید 8 کاراکتر باشد")
        .max(20, "رمز عبور باید کمتر از 20 کاراکتر باشد"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "رمزها مطابقت ندارند")
        .required("تکرار رمز عبور الزامی است"),
});

const Register = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value);
                }
            });

            const response = await axios.post("http://localhost:4000/v1/auth/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            authContext.login(response.data.accessToken, response.data.user);

            Swal.fire({
                title: "با موفقیت ثبت‌نام شدید",
                icon: "success",
                confirmButtonText: "اوکی ممنونم"
            }).then(() => {
                resetForm();
                navigate('/');
                window.location.reload();
            });

        } catch (error) {
            if (error.response?.status === 409) {
                Swal.fire({
                    title: "با این شماره تماس نمی‌توانید ثبت‌نام کنید!",
                    icon: "error",
                    confirmButtonText: "اوکی"
                });
            } else {
                Swal.fire({
                    title: "خطا در ثبت‌نام!",
                    text: error.response?.data?.message || "مشکلی پیش آمده",
                    icon: "error",
                    confirmButtonText: "تلاش مجدد"
                });
            }
        }
    };

    return (
        <div className="register">
            <div className="container">
                <h2 className="text-center mb-4 fs-1">فرم ثبت‌نام</h2>

                <Formik
                    initialValues={{
                        name: "",
                        username: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                        image: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="inputs-container">
                                <div className="row w-100">

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">نام</label>
                                            <Field name="name" type="text" className="form-control" />
                                            <ErrorMessage name="name" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">نام کاربری</label>
                                            <Field name="username" type="text" className="form-control" />
                                            <ErrorMessage name="username" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">ایمیل</label>
                                            <Field name="email" type="email" className="form-control" />
                                            <ErrorMessage name="email" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">شماره تماس</label>
                                            <Field name="phone" type="text" className="form-control" />
                                            <ErrorMessage name="phone" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">تصویر (اختیاری)</label>
                                            <input
                                                name="image"
                                                type="file"
                                                className="form-control"
                                                onChange={(event) => {
                                                    setFieldValue("image", event.currentTarget.files[0]);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-3">
                                        <div className="input-wrapper">
                                            <label className="form-label">رمز عبور</label>
                                            <Field name="password" type="password" className="form-control" />
                                            <ErrorMessage name="password" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-4">
                                        <div className="input-wrapper">
                                            <label className="form-label">تکرار رمز عبور</label>
                                            <Field name="confirmPassword" type="password" className="form-control" />
                                            <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 mb-4">
                                        <div className="input-wrapper no-bg">
                                            <button type="submit" className="submit-btn">
                                                ثبت‌نام
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <div className="input-wrapper no-bg">
                                            <div className="register-switch">
                                                <span>حساب کاربری دارید؟</span>
                                                <a href="/login">ورود</a>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;
