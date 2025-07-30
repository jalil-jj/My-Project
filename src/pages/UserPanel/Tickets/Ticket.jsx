import React from 'react'
import { Link } from 'react-router-dom'
import './Ticket.css'

export default function Ticket(props) {

    return (
        <div class="ticket-content__box">
            <div class="ticket-content__right">
                <div class="ticket-content__right-right">
                    <Link class="ticket-content__link" to={`/my-account/tickets/answer/${props._id}`}>
                        {props?.title}
                    </Link>
                    <span class="ticket-content__category">
                        {props?.DepartmentSubID?.title}
                    </span>
                </div>
            </div>
            <div class="ticket-content__left">
                <div class="ticket-content__left-right">
                    <div class="ticket-content__condition">
                        <span className={`ticket-content__condition ${props?.answer === 0 ? "ticket-content__condition-notanswer" : "ticket-content__condition-answer"}`}>
                            {
                                props?.answer === 0 ? 'پاسخ داده نشده' : 'پاسخ داده شده'
                            }
                        </span>
                    </div>
                </div>
                <div class="ticket-content__left-left">
                    <span class="ticket-content__time">{props?.createdAt.slice(0, 10)}</span>
                </div>
            </div>
        </div>
    )
}
