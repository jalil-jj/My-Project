import React, { useEffect, useState } from 'react'
import './AdminTickets.css'
import Table from 'react-bootstrap/Table';
import axios from "axios";
import swal from "sweetalert"

export default function AdminTickets() {

    const [tickets, setTickets] = useState([])

    useEffect(() => {
        getAllTickets()
    }, [])

    async function getAllTickets() {
        const localStorageData = JSON.parse(localStorage.getItem('user'));


        await axios.get('http://localhost:4000/v1/tickets', {
            headers: {
                Authorization: `Bearer ${localStorageData.token}`
            }
        })
            .then(res => {
                setTickets(res.data);
            })
            .catch(err => {
                console.error('❌ خطا:', err.response?.data || err.message);
            });
    }

    const seeTicketHandler = (ticket) => {
        const wrapper = document.createElement("div");
    
        // متن اصلی تیکت
        const text = document.createElement("p");
        text.textContent = ticket.body;
        wrapper.appendChild(text);
    
        // عکس‌ها
        ticket.covers?.forEach(cover => {
            const img = document.createElement("img");
            img.src = `http://localhost:4000/courses/covers/${cover}`;
            img.style.width = "100px";
            img.style.margin = "5px";
            img.style.borderRadius = "8px";
            img.classList.add("ticket-image");
            wrapper.appendChild(img);
        });
    
        swal({
            title: "جزئیات تیکت",
            content: wrapper,
            button: "باشه"
        });
    };
    

    const answerTicketHandler = (ticketID) => {

        const localStorageData = JSON.parse(localStorage.getItem('user'));

        swal({
            title: "پاسخ به تیکت",
            text: "لطفاً پاسخ خود را وارد کنید:",
            content: {
                element: "input",
                attributes: {
                    placeholder: "پاسخ را بنویسید...",
                    type: "text",
                },
            },
            buttons: ["لغو", "ارسال"]
        }).then(answerText => {
            if (!answerText) return;

            axios.post('http://localhost:4000/v1/tickets/answer', {
                ticketID,
                body: answerText
            }, {
                headers: {
                    Authorization: `Bearer ${localStorageData.token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    swal("موفق!", "پاسخ با موفقیت ثبت شد ✅", "success");
                    getAllTickets()
                })
                .catch(err => {
                    console.error("❌ خطا در ارسال پاسخ:", err.response?.data || err.message);
                    swal("خطا!", "ارسال پاسخ انجام نشد ❌", "error");
                });
        });



    }

    const removeTicketHandler = (ticketID) => {
        const localStorageData = JSON.parse(localStorage.getItem('user'))

        swal({
            title: "آیا از حذف تیکت اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        }).then(userConfirmed => {
            if (userConfirmed) {
                return axios.delete(
                    `http://localhost:4000/v1/tickets/${ticketID}`,
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
                    title: "تیکت با موفقیت حذف شد .",
                    icon: "success",
                    button: "حله"
                });
                getAllTickets()
            })
            .catch(err => {
                console.log("error:", err.message);
            });
    }



    return (
        <div className='AdminTickets'>
            <div className='table-wrapper'>
                <h2>کامنت ها</h2>
                <Table bordered hover className='table'>
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>عنوان</th>
                            <th>دپارتمان</th>
                            <th>زیر مجموعه دپارتمان</th>
                            <th>اولویت</th>
                            <th>کاربر</th>
                            <th>مشاهده</th>
                            <th>پاسخ</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tickets.map((ticket, index) => (
                                <tr>
                                    <td style={{ backgroundColor: ticket.answer === 1 ? 'red' : 'transparent' }}>{index + 1}</td>
                                    <td>{ticket?.title}</td>
                                    <td>{ticket?.DepartmentID?.title}</td>
                                    <td>{ticket?.DepartmentSubID?.title}</td>
                                    <td>{ticket?.priority}</td>
                                    <td>{ticket?.user?.name}</td>
                                    <td>
                                        <button className='btn btn-info fs-5' onClick={() => seeTicketHandler(ticket)}>مشاهده</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-info fs-5' onClick={() => answerTicketHandler(ticket._id)}>پاسخ</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-danger fs-5' onClick={() => removeTicketHandler(ticket._id)}>حذف</button>
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
