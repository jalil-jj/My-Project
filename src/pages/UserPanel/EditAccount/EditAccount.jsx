import React, { useContext, useEffect, useState } from "react";
import AuthContext from './../../../Contex/authContex'

import './EditAccount.css'
import swal from "sweetalert";

export default function EditAccount() {

    const authContext = useContext(AuthContext)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    console.log("authContext" , authContext?.userInfos?.user);

    useEffect(() => {
        setName(authContext?.userInfos?.user?.name || "هیچی")
        setPhone(authContext?.userInfos?.user?.phone)
        setUsername(authContext?.userInfos?.user?.username)
        setEmail(authContext?.userInfos?.user?.email)
    }, [authContext?.userInfos?.user])


    const editHandler = (event) => {
        event.preventDefault()

        const newInfos = {
            name,
            username,
            phone,
            email,
            password
        }

        if (password && password.trim() !== "") {
            newInfos.password = password
        }

        fetch(`http://localhost:4000/v1/users/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
            },
            body: JSON.stringify(newInfos)
        }).then(res => {
            if (res.ok) {
                swal({
                    title: 'اطلاعات با موفقیت ویرایش شد',
                    icon: 'success',
                    buttons: 'ایول بابا'
                })
            }
        })

    }

    return (
        <div class="col-9">
            <div class="edit">
                <form class="edit__form" action="#">
                    <div class="edit__personal">
                        <div class="row">
                            <div class="col-12">
                                <label class="edit__label">شماره موبایل *</label>
                                <input
                                    class="edit__input"
                                    type="text"
                                    value={phone}
                                    onChange={event => setPhone(event.target.value)}
                                    placeholder="لطفا شماره موبایل خود را وارد کنید"
                                />
                            </div>

                            <div class="col-12">
                                <label class="edit__label">نام و نام خانوادگی *</label>
                                <input
                                    class="edit__input"
                                    type="text"
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                    placeholder="لطفا نام نمایشی خود را وارد کنید"
                                />
                            </div>
                            <div class="col-12">
                                <label class="edit__label">نام کاربری (نمایشی) *</label>
                                <input
                                    class="edit__input"
                                    type="text"
                                    value={username}
                                    onChange={event => setUsername(event.target.value)}
                                    placeholder="لطفا نام نمایشی خود را وارد کنید"
                                />
                                <span class="edit__help">
                                    اسم شما به این صورت در حساب کاربری و نظرات دیده خواهد شد.
                                </span>
                            </div>
                            <div class="col-12">
                                <label class="edit__label">آدرس ایمیل *</label>
                                <input
                                    class="edit__input"
                                    type="text"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    placeholder="لطفا نام نمایشی خود را وارد کنید"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="edit__password">
                        <span class="edit__password-title">تغییر گذرواژه</span>
                        <div class="row">
                            <div class="col-12">
                                <label class="edit__label">گذرواژه جدید</label>
                                <input
                                    class="edit__input"
                                    type="text"
                                    placeholder="گذرواژه جدید"
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <button class="edit__btn" type="submit" onClick={editHandler}>
                        ذخیره تغییرات
                    </button>
                </form>
            </div>
        </div>
    );
}
