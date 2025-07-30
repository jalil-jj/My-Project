import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Ticket from "./Ticket";

import "./Tickets.css";

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const answeredTicketsCount = tickets.filter(ticket => ticket.answer === 1).length;
    const sendTicketsCount = tickets.filter(ticket => ticket.isAnswer === 0).length;

console.log("sendTicketsCount" , sendTicketsCount);

    useEffect(() => {
        fetch(`http://localhost:4000/v1/tickets/user`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
                    }`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTickets(data);
            });
    }, []);


    return (
        <div class="col-9">
            <div class="ticket">
                <div class="ticket-header">
                    <span class="ticket-header__title">همه تیکت ها</span>
                    <Link class="ticket-header__link" to="/my-account/send-ticket">
                        ارسال تیکت جدید
                    </Link>
                </div>
                <div class="ticket-boxes">
                    <div class="ticket-boxes__item">
                        <img class="ticket-boxes__img img-fluid" src="/images/ticket.svg" />
                        <span class="ticket-boxes__condition">ارسال شده</span>
                        <span class="ticket-boxes__value">{sendTicketsCount}</span>
                    </div>
                    <div class="ticket-boxes__item ticket-boxes__answered ticket-boxes__custom">
                        <img class="ticket-boxes__img img-fluid" src="/images/ticket.svg" />
                        <span class="ticket-boxes__condition">پاسخ داده شده</span>
                        <span class="ticket-boxes__value ticket-boxes__value-answered">
                            {answeredTicketsCount}
                        </span>
                    </div>
                    <div class="ticket-boxes__item">
                        <img class="ticket-boxes__img img-fluid" src="/images/ticket.svg" />
                        <span class="ticket-boxes__condition">همه</span>
                        <span class="ticket-boxes__value">{tickets.length}</span>
                    </div>
                </div>
                {tickets.length === 0 ? (
                    <div className="alert alert-warning">برای شما هیچ تیکتی ثبت نشده است</div>
                ) : (
                    <div className="ticket-content">
                        <span className="ticket-content__title">نمایش {tickets.filter(t => t.isAnswer === 0).length} تیکت</span>
                        {tickets
                            .filter(t => t.isAnswer === 0)
                            .map(item => (
                                <Ticket key={item._id} {...item} />
                            ))
                        }
                    </div>
                )}

            </div>
        </div>
    );
}
