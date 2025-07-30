import React, { useContext, useEffect, useState } from 'react'
import './AdminTopbar.css'
import { IoMdNotificationsOutline } from "react-icons/io";
import AuthContext from '../../../Contex/authContex'
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


export default function AdminTopbar() {

  const authContext = useContext(AuthContext)
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const [notifs, setNotifs] = useState([])




  useEffect(() => {
    getAllNotifs()
  }, [])


  async function getAllNotifs() {
    const localStorageData = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await axios.get('http://localhost:4000/v1/notification/admin', {
        headers: {
          Authorization: `Bearer ${localStorageData.token}`
        }
      });
      setNotifs(response.data);
    } catch (err) {
      console.error('خطا در گرفتن دسته‌بندی‌ها:', err);
    }
  }


  const leaveHandler = () => {
    swal({
      title: 'آیا از خارج شدن از اکانت خود اطمینان دارید؟',
      icon: 'warning',
      buttons: ["خیر", "بلی"]
    }).then(isAccept => {
      if (isAccept) {
        authContext.logout();
        navigate('/')
        swal({
          title: "با موفقیت خارج شدید.",
          icon: "success",
          button: "باشه"
        });
      }
    });
  };

  const seenHandler = (notifID) => {
    swal({
      title: "آیا با دقت پیغام را خواندید؟",
      icon: "warning",
      buttons: ["خیر", "بلی"]
    }).then(isAccept => {
      if (isAccept) {
        const localStorageData = JSON.parse(localStorage.getItem('user'));

        axios.put(
          `http://localhost:4000/v1/notification/${notifID}/see`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorageData.token}`
            }
          }
        )
          .then(res => {
            swal({
              title: "عملیات با موفقیت انجام شد :)",
              icon: "success",
              button: "دمت گرم"
            })
            getAllNotifs();
          })
          .catch(err => {
            swal({
              title: "عملیات با خطا مواجه شد :(",
              icon: "error",
              button: "اووووف ، باشه"
            })
          });
      }
    });
  }



  return (
    <div className='admin-topbar'>
      <div className='content'>
        <div className="admin-info">
          <div className="avatar-wrapper">
            <img
              src={`http://localhost:4000/courses/covers/${authContext?.userInfos?.user?.image}`}
              alt="پروفایل"
              className="avatar-img"
            />
            <div className="avatar-preview">
              <img
                src={`http://localhost:4000/courses/covers/${authContext?.userInfos?.user?.image}`}
                alt="بزرگ‌شده"
              />
            </div>
          </div>
          <h2>{authContext?.userInfos?.user?.name}</h2>
        </div>

        <div className='admin-notif'>
          <div
            className="notif-wrapper"
            onMouseEnter={() => setShowList(true)}
            onMouseLeave={() => setShowList(false)}
          >
            <IoMdNotificationsOutline className="admin-notif-icon" />

            {showList && (
              <div className="notif-list">
                <ul>
                  {
                    notifs.length === 0 ? (
                      <p>هیچ نوتیفیکیشنی وجود ندارد</p>
                    ) : (
                      notifs.map(notif => (
                        <li
                          key={notif._id}
                          style={{ backgroundColor: notif?.seen === 1 ? 'lightgreen' : 'transparent' }}
                          onClick={() => seenHandler(notif._id)}
                        >
                          {notif.message}
                        </li>
                      ))
                    )
                  }
                </ul>
              </div>
            )}
          </div>

          <button className="logout-button" onClick={leaveHandler}>خروج از حساب</button>
        </div>
      </div>
    </div>
  )
}
