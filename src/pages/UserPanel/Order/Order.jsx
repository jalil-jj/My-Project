import React, { useEffect, useState } from "react";

import "./Order.css";
import { NavLink } from 'react-router-dom'

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/v1/orders`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
          }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOrders(data);
      });
  }, []);

  return (
    <div class="col-9">
      <div class="order">
        <table class="order__table">
          <thead class="order__table-header">
            <tr class="order__table-header-list">
              <th class="order__table-header-item">شناسه</th>
              <th class="order__table-header-item">تاریخ</th>
              <th class="order__table-header-item">وضعیت</th>
              <th class="order__table-header-item">دوره</th>
              <th class="order__table-header-item">مبلغ</th>
              <th class="order__table-header-item">عملیات ها</th>
            </tr>
          </thead>
          <tbody class="order__table-body">
            {orders.map((order, index) => (
              <tr class="order__table-body-list">
                <td class="order__table-body-item">
                  <span class="order__table-body-link">
                    {index + 1}
                  </span>
                </td>
                <td class="order__table-body-item">{order?.createdAt.slice(0, 10)}</td>
                <td class="order__table-body-item">{order?.course?.status}</td>
                <td class="order__table-body-item">
                  {
                    order.course === null ? 'از طرف بک اند درست ارسال نشده' : order?.course?.name
                  }
                </td>
                <td class="order__table-body-item">
                  {order.price}
                </td>
                <td className="order__table-body-item">
                  <NavLink to={`/courses/${order?.course?.href}`} className="order__table-body-btn">
                    نمایش
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}
