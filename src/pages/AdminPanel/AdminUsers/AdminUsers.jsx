import React, { useEffect, useState } from 'react'
import './AdminUsers.css'
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert'

export default function AdminUsers() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    getAllUsers()
  }, [])

  function getAllUsers() {
    const localStorageData = JSON.parse(localStorage.getItem('user'));


    axios.get('http://localhost:4000/v1/users', {
      headers: {
        Authorization: `Bearer ${localStorageData.token}`
      }
    })
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('❌ خطا:', err.response?.data || err.message);
      });
  }

  function removeHandler(userID) {
    const localStorageData = JSON.parse(localStorage.getItem('user'));

    swal({
      title: "آیا از حذف کاربر مطمئن هستید؟",
      icon: "warning",
      buttons: ['خیر', 'بله'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete(`http://localhost:4000/v1/users/${userID}`, {
            headers: {
              Authorization: `Bearer ${localStorageData.token}`
            }
          })
            .then(() => {
              swal({
                title: 'کاربر با موفقیت حذف شد',
                icon: "success",
                button: 'اوکی'
              });
              getAllUsers();
            })
            .catch((err) => {
              console.error('خطا در حذف کاربر:', err);
              swal({
                title: 'خطایی رخ داد',
                text: err.response?.data?.message || err.message,
                icon: "error",
                button: 'باشه'
              });
            });
        }
      });
  }

  function changeRoleHandler(userID) {
    console.log("userID received:", userID);
    const localStorageData = JSON.parse(localStorage.getItem('user'));

    swal({
      title: "آیا از تغییر نقش مطمئن هستید؟",
      icon: "warning",
      buttons: ['خیر', 'بله']
    })
      .then((willChange) => {
        if (willChange) {
          return axios.put(
            "http://localhost:4000/v1/users/role",
            { id: userID },
            {
              headers: {
                Authorization: `Bearer ${localStorageData.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      })
      .then((res) => {
        if (res) {
          swal({
            title: "نقش با موفقیت تغییر کرد",
            icon: "success",
            button: "اوکی"
          });
          getAllUsers();
        }
      })
      .catch(err => {
        console.error("❌ خطا در تغییر نقش:", err);
        swal({
          title: "خطا",
          text: err.response?.data?.message || err.message,
          icon: "error",
          button: "باشه"
        });
      });
  }

  function banUserHandler(userID) {
    const localStorageData = JSON.parse(localStorage.getItem('user'));

    swal({
      title: 'آیا از بن کردن کاربر مطمعن هستید ؟',
      icon: 'warning',
      buttons: ['خیر', 'بله']
    })
      .then((willChange) => {
        if (willChange) {
          return axios.post(`http://localhost:4000/v1/users/ban/${userID}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorageData.token}`
              }
            })
        }
      })
      .then(res => {
        if (res) {
          swal({
            title: 'کاربر با موفقیت بن شد .',
            icon: 'success',
            button: 'اوکی'
          })
          getAllUsers()
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  function editUserHandler(user) {
    const localStorageData = JSON.parse(localStorage.getItem('user'));
  
    swal({
      title: "ویرایش اطلاعات کاربر",
      content: createForm(user),
      buttons: ['انصراف', 'ذخیره']
    }).then((willSave) => {
      if (willSave) {
        const updatedUser = {
          name: document.getElementById('swal-name').value,
          username: document.getElementById('swal-username').value,
          email: document.getElementById('swal-email').value,
          password: document.getElementById('swal-password').value,
          phone: document.getElementById('swal-phone').value,
        };
  
        // اگر رمز عبور خالی بود، ارسالش نمی‌کنیم
        if (!updatedUser.password) delete updatedUser.password;
  
        axios.put(`http://localhost:4000/v1/users/${user._id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${localStorageData.token}`
          }
        })
          .then(() => {
            swal("کاربر با موفقیت ویرایش شد", {
              icon: "success",
            });
            getAllUsers();
          })
          .catch(err => {
            console.error("❌ خطا:", err);
            swal("خطا در ویرایش", err.response?.data?.message || err.message, "error");
          });
      }
    });
  }
  
  // تابع ساختن فرم با مقدارهای پیش‌فرض
  function createForm(user) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <input id="swal-name" class="swal-content__input" placeholder="نام" value="${user.name || ''}" />
      <input id="swal-username" class="swal-content__input" placeholder="نام کاربری" value="${user.username || ''}" />
      <input id="swal-email" class="swal-content__input" placeholder="ایمیل" value="${user.email || ''}" />
      <input id="swal-password" class="swal-content__input" placeholder="رمز عبور (اختیاری)" type="password" />
      <input id="swal-phone" class="swal-content__input" placeholder="تلفن" value="${user.phone || ''}" />
    `;
    return wrapper;
  }
  





  return (
    <div className='admin-users'>
      <div className='table-wrapper'>
        <h2>لیست کاربران</h2>
        <Table bordered hover className='table'>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام و نام خانوادگی</th>
              <th>نقش</th>
              <th>ایمیل</th>
              <th>ویرایش</th>
              <th>تغییر نقش</th>
              <th>حذف</th>
              <th>بن</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.email}</td>
                  <td>
                    <button className='btn btn-success fs-5' onClick={() => editUserHandler(item)}>ویرایش</button>
                  </td>
                  <td>
                    <button className='btn btn-success fs-5' onClick={() => changeRoleHandler(item._id)}>تغییر نقش</button>
                  </td>
                  <td>
                    <button className='btn btn-danger fs-5' onClick={() => removeHandler(item._id)}>حذف</button>
                  </td>
                  <td>
                    <button className='btn btn-danger fs-5' onClick={() => banUserHandler(item._id)}>بن</button>
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
