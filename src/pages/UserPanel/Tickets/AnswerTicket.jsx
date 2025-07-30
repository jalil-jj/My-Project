import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./AnswerTicket.css";

export default function TicketAnswer() {
    const { id } = useParams();
    const [ticketInfo, setTicketInfo] = useState({});


    useEffect(() => {
        fetch(`http://localhost:4000/v1/tickets/${id}/answer`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
                    }`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTicketInfo(data);
            });
    }, []);

    console.log("ticketInfo", ticketInfo);

    return (
        <div class="col-9">
            <div class="ticket">
                <div class="ticket-header">
                    <span class="ticket-header__title">همه تیکت ها</span>
                    <Link class="ticket-header__link" to="/my-account/send-ticket">
                        ارسال تیکت جدید
                    </Link>
                </div>
                <div class="ticket-top">
                    <div class="ticket-top__right">
                        <a class="ticket-top__link" href="#">
                            <i class="fa fa-angle-right ticket-top__icon"></i>
                        </a>
                    </div>
                    <div className="ticket-top__left">
                        <span className="ticket-top__title">{ticketInfo?.ticket?.title}</span>
                        <span className="ticket-top__text">شناسه تیکت : {ticketInfo?.ticket?._id}</span>
                    </div>
                </div>
                <div class="ticket-send">
                   
                    <div class="ticket-send__title">
                        <span class="ticket-send__title-text">
                            <i class="ticket-send__title-icon fa fa-plus"></i>
                             تیکت کاربر
                        </span>
                    </div>
                    <div class="ticket-send__answer">
                        <div class="ticket-send__answer-box">
                            <p class="ticket-send__answer-text">عنوان تیکت : {ticketInfo?.ticket?.title}</p>
                            <p class="ticket-send__answer-text">متن تیکت :  {ticketInfo?.ticket?.body}</p>
                        </div>
                        <div class="ticket-send__answer-bottom">
                            <span class="ticket-send__answer-name ticket-send__answer-span">
                                {ticketInfo?.ticket?.user?.name}
                            </span>
                            <span class="ticket-send__answer-date ticket-send__answer-span">
                                {ticketInfo?.ticket?.createdAt?.split("T")[0]}
                            </span>
                            <p class="ticket-send__answer-time ticket-send__answer-span">
                                {ticketInfo?.ticket?.createdAt?.split("T")[1]?.slice(0, 5)}
                            </p>
                        </div>
                    </div>
                    <div class="ticket-send__title">
                        <span class="ticket-send__title-text">
                            <i class="ticket-send__title-icon fa fa-plus"></i>
                            پاسخ ها
                        </span>
                    </div>

                    {/* بالا کاربر پایین ادمین */}

                    {ticketInfo?.ticketAnswer  === null ? (
                        <div className="alert alert-danger">
                            هنوز پاسخی برای تیکت ارسال نشده
                        </div>
                    ) : (
                        <div class="ticket-send__answer-user">
                            <div class="ticket-send__answer-user-box">
                                <p class="ticket-send__answer-user-text">پاسخ تیکت :  {ticketInfo?.ticketAnswer?.body}</p>
                            </div>
                            <div class="ticket-send__answer-user-bottom">
                                <span class="ticket-send__answer-user-name ticket-send__answer-user-span">
                                    {ticketInfo?.ticketAnswer?.user?.name}
                                </span>
                                <span class="ticket-send__answer-user-date ticket-send__answer-user-span">
                                    {ticketInfo?.ticketAnswer?.createdAt?.split("T")[0]}
                                </span>
                                <p class="ticket-send__answer-user-time ticket-send__answer-user-span">
                                    {ticketInfo?.ticketAnswer?.createdAt?.split("T")[1]?.slice(0, 5)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
