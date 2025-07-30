import React, { useEffect, useState } from 'react'
import './AdminContact.css'
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert';



export default function AdminContact() {

    const [contacts, setContacts] = useState([])

    useEffect(() => {
        getAllContacts()
    }, [])

    async function getAllContacts() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/contact', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setContacts(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }


    const answerContactHandler = (userEmail) => {
        swal({
            title: "پاسخ به کاربر",
            text: "پاسخ خود را وارد کنید:",
            content: "input",
            buttons: ["لغو", "ارسال"],
        }).then((answer) => {
            if (answer) {
                const localStorageData = JSON.parse(localStorage.getItem('user'));
    
                axios.post("http://localhost:4000/v1/contact/answer", {
                    email: userEmail,
                    answer: answer
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    swal("موفقیت‌آمیز!", "پاسخ با موفقیت ارسال شد. ✅", "success");
                    getAllContacts()
                }).catch((err) => {
                    swal("خطا!", "ارسال پاسخ با خطا مواجه شد. ❌", "error");
                    console.error(err);
                });
            }
        });
    };
    

    const seeContactHandler = (contact) => {
        swal({
            title: contact.body,
            button: "دیدم"
        })
    }

    const removeHandler = (contactID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: 'آیا از حذف پیغام مطمئن هستید؟',
            icon: 'warning',
            buttons: ['خیر', 'بلی']
        }).then((userChoice) => {
            if (userChoice) {
                axios.delete(`http://localhost:4000/v1/contact/${contactID}`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then((res) => {
                        swal({
                            title: 'پیغام با موفقیت حذف شد.',
                            icon: 'success',
                            button: 'باشه'
                        });
                        getAllContacts()
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
    }





    return (
        <div className='AdminContact'>
            <div className='table-wrapper'>
                <h2>لیست پیغام ها</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>نام و نام خانوادگی</th>
                            <th>ایمیل</th>
                            <th>مشاهده</th>
                            <th>پاسخ</th>
                            <th>حذف</th>
                            {/* <th>بن</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contacts.map((contact, index) => (
                                <tr key={contact._id || index}>
                                    <td style={{ backgroundColor: contact.answer === "1" ? 'lightgreen' : 'transparent' }}>{index + 1}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>
                                        <button className='btn btn-success fs-5' onClick={() => seeContactHandler(contact)}>مشاهده</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-info fs-5' onClick={() => answerContactHandler(contact.email)}>پاسخ</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeHandler(contact._id)}>حذف</button>
                                    </td>
                                    {/* <td>
                                        <button className='btn btn-danger fs-5' onClick={() => banUserHandler(contact._id)}>بن</button>
                                    </td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
