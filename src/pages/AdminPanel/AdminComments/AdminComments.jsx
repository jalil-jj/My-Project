import React, { useEffect, useState } from 'react'
import './AdminComments.css'
import Table from 'react-bootstrap/Table';
import axios from "axios";
import swal from "sweetalert"


export default function AdminComments() {

    const [comments, setComments] = useState([])

    useEffect(() => {
        getAllComments()
    }, [])



    async function getAllComments() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        try {
            const res = await axios.get('http://localhost:4000/v1/comments', {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                },
            });

            setComments(res.data);
        } catch (error) {
            console.error('خطا در دریافت کامنت‌ها:', error);
        }
    }


    const seeCommentsHandler = (comment) => {
        swal({
            title: comment.body,
            button: "دیدم"
        })
    }

    const acceptCommentHandler = (commentID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از پذیرفتن کامنت اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.put(
                    `http://localhost:4000/v1/comments/${commentID}/accept`,
                    {},
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
                    title: "کامنت با موفقیت پذیرفته شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllComments()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    };

    const rejectCommentHandler = (commentID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از رد کامنت اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.put(
                    `http://localhost:4000/v1/comments/${commentID}/reject`,
                    {},
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
                    title: "کامنت با موفقیت رد شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllComments()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    };

    const removeCommentHandler = (commentID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از حذف کامنت اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.delete(
                    `http://localhost:4000/v1/comments/${commentID}`,
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
                    title: "کامنت با موفقیت حذف شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllComments()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    };

    const answerCommentsHandler = (commentID) => {
        console.log(commentID);
        const localStorageData = JSON.parse(localStorage.getItem('user'))
        swal({
            title: "پاسخ به کاربر",
            text: "پاسخ خود را وارد کنید:",
            content: "input",
            buttons: ["لغو", "ارسال"],
        }).then((answer) => {
            if (answer) {
                axios.post(`http://localhost:4000/v1/comments/${commentID}/answer`, {
                    body: answer
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorageData.token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    swal("موفقیت‌آمیز!", "پاسخ با موفقیت ارسال شد. ✅", "success");
                    getAllComments()
                }).catch((err) => {
                    swal("خطا!", "ارسال پاسخ با خطا مواجه شد. ❌", "error");
                    console.error(err);
                });
            }
        });
    }

    return (
        <div className='admin-users'>
            <div className='table-wrapper'>
                <h2>کامنت ها</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>کابر</th>
                            <th>دوره</th>
                            <th>امتیاز</th>
                            <th>مشاهده</th>
                            <th>پاسخ</th>
                            <th>تایید</th>
                            <th>رد</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comments.map((comment, index) => (
                                <tr>
                                    <td style={{ backgroundColor: comment.isAccept === 1 ? 'lightgreen' : 'transparent' }}>{index + 1}</td>
                                    <td>{comment.creator}</td>
                                    <td>{comment.course}</td>
                                    <td>{comment.score}</td>
                                    <td>
                                        <button className='btn btn-info fs-5' onClick={() => seeCommentsHandler(comment)}>مشاهده</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-info fs-5' onClick={() => answerCommentsHandler(comment._id)}>پاسخ</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-success fs-5' onClick={() => acceptCommentHandler(comment._id)}>تایید</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-success fs-5' onClick={() => rejectCommentHandler(comment._id)}>رد</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeCommentHandler(comment._id)}>حذف</button>
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
