import React, { useEffect, useState } from 'react'
import './AdminNewsLetter.css'
import axios from 'axios'
import Table from 'react-bootstrap/Table';
import swal from 'sweetalert'


export default function AdminNewaLetter() {

    const [newsLetters, setNewsLetters] = useState([])

    useEffect(() => {
        getAllNewsLetters()
    }, [])


    async function getAllNewsLetters() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await axios.get('http://localhost:4000/v1/newsLetter', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`
                }
            });
            setNewsLetters(response.data);
        } catch (err) {
            console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
        }
    }

    const removeNewsLetterMemberHandler = (newsLetterID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))
        swal({
            title: 'آیا از حذف ایمیل از خبرنامه مطمئن هستید؟',
            icon: 'warning',
            buttons: ['لغو', 'بله، حذف شود'],
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`http://localhost:4000/v1/newsLetter/${newsLetterID}`, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`
                    }
                })
                    .then(res => {
                        swal({
                            title: 'عضو خبرنامه با موفقیت حذف شد.',
                            icon: 'success',
                            button: 'باشه'
                        });
                        getAllNewsLetters()
                    })
                    .catch(err => {
                        swal({
                            title: 'خطا در حذف!',
                            text: err.response?.data?.message || 'مشکلی پیش اومده.',
                            icon: 'error',
                            button: 'باشه'
                        });
                    });
            }
        });
    };

    console.log(newsLetters);

    return (
        <div className='AdminNewaLetter'>
            <div className='table-wrapper'>
                <h2>لیست ایمیل های عضو در خبرنامه</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>ایمیل</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            newsLetters.map((newsLetter, index) => (
                                <tr key={newsLetter._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{newsLetter.email}</td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeNewsLetterMemberHandler(newsLetter._id)}>حذف</button>
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
