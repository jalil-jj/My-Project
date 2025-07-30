import React from 'react'
import './ContactUs.css'
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import axios from 'axios'


export default function ContactUs() {

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("نام الزامی است"),
    email: Yup.string()
      .email("فرمت ایمیل معتبر نیست")
      .required("ایمیل الزامی است"),
    phone: Yup.string()
      .min(11, "شماره تماس باید حداقل 11 رقم باشد")
      .required(" شماره تماس الزامی است"),
    body: Yup.string()
      .required("متن پیام الزامی است"), 
  });


  return (
    <div className='contactus'>
      <div className='container'>
        <h1 className="text-center mb-4 fs-1">ارتباط با ما</h1>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            body: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            axios.post('http://localhost:4000/v1/contact', values)
              .then(() => {
                Swal.fire({
                  title: "پیام شما با موفقیت ارسال شد!",
                  icon: "success",
                  confirmButtonText: 'باشه'
                });
                resetForm();
              })
              .catch((error) => {
                Swal.fire({
                  title: "خطا در ارسال پیام",
                  text: error.response?.data?.message || "لطفاً دوباره تلاش کنید",
                  icon: "error",
                  confirmButtonText: 'باشه'
                });
              });
          }}
        >
          <Form>
            <div className="login-inputs-container mt-5">
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">نام</label>
                  <Field name="name" type="text" className="form-control mt-2" />
                  <ErrorMessage name="name" component="div" className="form-error" />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">ایمیل</label>
                  <Field name="email" type="email" className="form-control mt-2" />
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">شماره تماس</label>
                  <Field name="phone" type="text" className="form-control mt-2" />
                  <ErrorMessage name="phone" component="div" className="form-error" />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">پیغام</label>
                  <Field
                    name="body"
                    as="textarea"
                    rows="4"
                    className="form-control mt-2"
                  />
                  <ErrorMessage name="body" component="div" className="form-error" />
                </div>

                <button type="submit" className="btn btn-primary fs-3 w-100 mt-5 mb-5">
                  ارسال پیغام
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}
