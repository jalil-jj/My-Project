import { Form, Formik, Field, ErrorMessage } from 'formik';
import React, { useContext } from 'react';
import './Login.css'
import Swal from 'sweetalert2';
import * as Yup from "yup";
import axios from "axios";
import AuthContext from '../../Contex/authContex';
import { useNavigate } from "react-router-dom";



export default function Login() {

    const authContex = useContext(AuthContext)
    const navigate = useNavigate()



    const validationSchema = Yup.object({
        usernameOrEmail: Yup.string()
            .required("نام کاربری یا ایمیل الزامی است")
            .test("is-email-or-username", "فرمت ایمیل معتبر نیست", value =>
                value.includes("@") ? Yup.string().email("فرمت ایمیل معتبر نیست").isValidSync(value) : true),
        password: Yup.string()
            .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
            .required("رمز عبور الزامی است"),
    });

    return (
        <div className='login'>
            <div className='container'>
                <h1 className="text-center mb-4 fs-1">ورود</h1>
                <Formik
                    initialValues={{
                        usernameOrEmail: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        try {
                            const response = await axios.post("http://localhost:4000/v1/auth/login", {
                                identifier: values.usernameOrEmail,
                                password: values.password
                            });

                            authContex.login(response.data.accessToken, response.data.user)

                            Swal.fire({
                                icon: "success",
                                title: "ورود موفقیت‌آمیز بود!",
                                text: `خوش آمدید ${response.data.user.name}`
                            }).then(() => {
                                navigate('/')
                                window.location.reload();
                            });

                            resetForm();

                        } catch (error) {
                            console.log(error);
                            Swal.fire({
                                icon: "error",
                                title: "ورود ناموفق",
                                text: error.response?.data?.message || "مشکلی در ورود رخ داده است"
                            });
                        }

                    }}
                >
                    <Form>
                        <div className="login-inputs-container mt-5">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label className="form-label">نام کاربری یا ایمیل</label>
                                    <Field name="usernameOrEmail" type="text" className="form-control mt-2" />
                                    <ErrorMessage name="usernameOrEmail" component="div" className="form-error" />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">رمز عبور</label>
                                    <Field name="password" type="password" className="form-control mt-2" />
                                    <ErrorMessage name="password" component="div" className="form-error" />
                                </div>

                                <button type="submit" className="btn btn-primary fs-3 w-100 mt-5 mb-5">
                                    ورود
                                </button>
                                <div className="login-switch">
                                    <span>حساب کاربری ندارید؟</span>
                                    <a href="/register">ثبت‌نام</a>
                                </div>
                            </div>

                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
