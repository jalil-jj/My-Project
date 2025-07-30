import React, { useContext, useEffect, useState } from 'react'
import './SessionDetailes.css'
import { useParams } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar'
import { NavLink } from 'react-router-dom';
import Footer from '../../components/Footer/Footer'
import AuthContext from '../../Contex/authContex';
import { CiLock } from "react-icons/ci";
import axios from 'axios';


export default function SessionDetailes() {
  const { shortName, sessionID } = useParams();
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([])
  const authContext = useContext(AuthContext)
  const isRegistered = authContext?.userInfos?.courses?.some(course =>
    course.name.toLowerCase() === shortName.toLowerCase()
  );


  useEffect(() => {
    async function fetchSession() {
      const localStorageData = JSON.parse(localStorage.getItem("user"));
      const token = localStorageData?.token;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch(`http://localhost:4000/v1/courses/${shortName}/${sessionID}`, { headers });

        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setAllSessions(data.allSessions);
        } else if (res.status === 401 || res.status === 403) {
          const freeRes = await fetch(`http://localhost:4000/v1/courses/${shortName}/${sessionID}/free`);
          if (freeRes.ok) {
            const freeData = await freeRes.json();
            setSession(freeData.session);
            setAllSessions(freeData.allSessions);
          } else {
            console.error("دسترسی به جلسه وجود ندارد");
            setSession(null);
            setAllSessions([]);
          }
        } else {
          throw new Error("خطا در دریافت اطلاعات");
        }
      } catch (error) {
        console.error("FETCH ERROR:", error);
        setSession(null);
        setAllSessions([]);
      }
    }

    fetchSession();
  }, [shortName, sessionID]);



  console.log("allSessions", allSessions);

  return (
    <div className='SessionDetailes'>
      <Topbar />

      <div className='container'>
        <div className='row'>

          <div className='col-12 col-md-8'>
            <div className='viseo-section'>
              {(session?.free === 0 || isRegistered) ? (
                <>
                  <h2 className='title'>{session?.title}</h2>
                  <div className='video-show'>
                    <video
                      src={`http://localhost:4000/courses/covers/${session?.video}`}
                      controls
                      className='video'
                    >
                      مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
                    </video>
                  </div>
                </>
              ) : (
                <div className='video-locked'>
                  <h4 className='title'>برای مشاهده این جلسه باید در دوره ثبت‌نام کنید.</h4>
                </div>
              )}
            </div>
          </div>


          <div className='col-12 col-md-4'>
            <div className='all-section'>
              {allSessions?.map(item => (
                <NavLink
                  to={(item.free === 0 || isRegistered) ? `/courses/${shortName}/${item._id}` : '#'}
                  key={item._id}
                >
                  <div className="session-item">
                    <h4>{item.title}</h4>
                    <p>مدت زمان: {item.time}</p>
                    {
                      (item.free === 0 || isRegistered) ? null : <CiLock />
                    }
                  </div>
                </NavLink>
              ))}
            </div>
          </div>


        </div>
      </div>

      <Footer />
    </div>
  );
}
