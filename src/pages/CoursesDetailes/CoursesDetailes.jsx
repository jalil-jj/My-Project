import React, { useContext, useEffect, useState } from 'react'
import './CoursesDetailes.css'
import Topbar from './../../components/Topbar/Topbar'
import Footer from './../../components/Footer/Footer'
import { useParams } from 'react-router-dom';

import { IoBookOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { PiUsersThree } from "react-icons/pi";
import { FaRegStar } from "react-icons/fa";
import { IoBagOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { MdIncompleteCircle } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";
import swal from 'sweetalert';
import AuthContext from '../../Contex/authContex';
import { NavLink } from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";

export default function CoursesDetailes() {

    const { shortName, sessionID } = useParams()

    const [course, setCourse] = useState(null)
    const [comments, setComments] = useState([])
    const [courseStudentCount, setCourseStudentCount] = useState(null)
    const [sessions, setSessions] = useState([])

    const [body, setBody] = useState("");
    const [score, setScore] = useState(4);
    const authContext = useContext(AuthContext)
    const isRegistered = authContext?.userInfos?.courses?.some(course =>
        course.name.toLowerCase() === shortName.toLowerCase()
    );

    useEffect(() => {
        getOneCourse()
        getAllSessions()
    }, [])

    console.log("cooooom" , comments);

    function getOneCourse() {
        fetch(`http://localhost:4000/v1/courses/${shortName}`)
            .then(res => res.json())
            .then(data => {
                setCourse(data.course)
                setComments(data.comments)
                setCourseStudentCount(data.courseStudentCount)
            })
    }


    function getAllSessions() {
        fetch(`http://localhost:4000/v1/courses/sessions/${shortName}`)
            .then(res => res.json())
            .then(data => {
                setSessions(data)
            })
    }




    const sendComment = () => {

        const localStorageData = JSON.parse(localStorage.getItem("user"))


        swal({
            title: "آیا از ارسال نظر اطمینان دارید ؟",
            icon: "warning",
            buttons: ["خیر", "بلی"]
        })
            .then(res => {
                if (res) {
                    fetch("http://localhost:4000/v1/comments", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorageData.token}`,
                        },
                        body: JSON.stringify({
                            body,
                            score,
                            coursehref: shortName,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            swal({
                                title: "نظر شما با موفقیت ارسال شد !",
                                icon: "success",
                                button: "دمت گرم"
                            })
                            setBody('')
                        });
                } else {
                    console.log("User canceled the comment sending.");
                }
            });
    };

    const cansleComment = () => {
        setBody('')
    }


    return (
        <div className='coursesdetailes'>

            <Topbar />

            <div className="container">

                <div className='top'>
                    <div className='row'>
                        <div className='col-12 col-lg-6'>
                            <div className='top-description'>
                                <h2>{course?.name}</h2>
                                <p>{course?.description}</p>
                                <div className='price-wrapper'>
                                    <button className='btn btn-success fs-5'>
                                        <IoBookOutline className='fs-1 ms-4' />
                                        افزودن به سبد خرید
                                    </button>
                                    <span>{course?.price === 0 ? "رایگان" : course?.price + ' تومان'} </span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-lg-6'>
                            <div className='top-movie'>
                                <video className='film' src="/film/db6485f888c86d853d68a8199a8800b062707383-360p.mp4" controls></video>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='session-detailes'>
                    <div className="row g-3">

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><FaRegCircleQuestion /></div>
                                <div>
                                    <h4>وضعیت</h4>
                                    <p>{course?.status}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><FaRegClock /></div>
                                <div>
                                    <h4>پشتیبانی</h4>
                                    <p>{course?.support}</p>
                                </div>
                            </div>
                        </div>
                       
                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><PiUsersThree /></div>
                                <div>
                                    <h4>دانشجو</h4>
                                    <p><span>{courseStudentCount}</span> نفر</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><FaRegStar /></div>
                                <div>
                                    <h4>رضایت</h4>
                                    <p>5.0</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><IoBagOutline /></div>
                                <div>
                                    <h4>پیش نیاز</h4>
                                    <p>ندارد</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><CiVideoOn /></div>
                                <div>
                                    <h4>دسته بندی</h4>
                                    <p>{course?.categoryID?.title}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-4 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><MdIncompleteCircle /></div>
                                <div>
                                    <h4>مدت زمان دوره</h4>
                                    <p> <span>0</span>ساعت</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 col-sm-6 col-md-3 h-100">
                            <div className='session-detailes-box'>
                                <div><SlCalender /></div>
                                <div>
                                    <h4 className='box-title'>آخرین به روزرسانی</h4>
                                    <p>{course?.updatedAt?.slice(0, 10)}</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="teacher">
                    <div className='row'>
                        <div className='col-12'>
                            <div className='teacher-detailes'>
                                <img  src={`http://localhost:4000/courses/covers/${course?.creator?.image}`} alt="" />
                                <h2>{course?.creator?.name || "مدرس نامشخص"} | مدرس دوره</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='interduction'>
                    <h2 className='title'>توضیحات</h2>
                    <div className='interduction-img'>
                        <img src={`http://localhost:4000/courses/covers/${course?.cover}`} alt={course?.name} />
                    </div>
                    <h2 className='interduction-title'>معرفی دوره آموزش {course?.name}</h2>
                    <p>
                        اگر در زمینه کدنویسی با جاوا اسکریپت فعالیت دارید و به‌دنبال ابزاری برای بهبود کدهای خود هستید، یادگیری Eslint قطعا برای شما مفید خواهد بود. این ابزار با شناسایی خطاهای معمول و تشخیص ناسازگاری‌ها در کدنویسی، به برنامه‌نویسان کمک می‌کند تا کدهایی بهینه‌تر و مطابق با استانداردهای روز جهانی بنویسند. در دوره آموزش Eslint سبزلرن یاد می‌گیرید که چطور با این ابزار کار کنید و استانداردهای دلخواه خود را برای پروژه‌های مختلف کدنویسی تعریف نمایید.

                        یکی از مزیت‌های شرکت در دوره آموزش جامع Eslint سبزلرن بیان صفر تا صد روش کار با این ابزار است که با جزئیات و مثال‌های کاربردی بیان می‌شود. اگر به‌دنبال پیشرفت در مسیر برنامه‌نویسی هستید و می‌خواهید خطاهای رایج در کدنویسی را نداشته باشید، شرکت در دوره Eslint آکادمی سبزلرن بهترین راه برای رسیدن به مقصود است.
                    </p>
                    <h2 className='interduction-title'>چه مطالبی را می‌توان با شرکت در دوره آموزش {course?.name} سبزلرن یاد گرفت؟</h2>
                    <p>
                        دوره آموزش eslint به کمک برنامه‌نویسان آمده تا بتوانند با این ابزار کاربردی کدهای با حداقل خطا بنویسند و زمان خود را برای رفع ایردات هدر ندهند! این ابزار برای پروژه‌های کوچک و بزرگ، و تیم‌های توسعه بسیار کاربردی است و در حال حاضر اغلب گروه‌ها و شرکت‌های برنامه‌نویسی برای کاهش خطاهای خود از eslint استفاده می‌کنند. نحوه کار با این ابزار برای کاهش خطاها و افزایش قابلیت نگهداری و خوانایی کدها از دیگر نکاتی است که در دوره eslint آکادمی سبزلرن آموزش داده می‌شود.
                    </p>
                </div>

                <div className='movies'>
                    <h2 className='title'>سرفصل ها</h2>
                    <div className="accordion" id="accordionExample">

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button fs-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    دسته اول
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    {sessions.map(session => (
                                        <NavLink
                                            to={session.free === 0 || isRegistered ? `/courses/${shortName}/${session._id}` : '#'}
                                            key={session._id}
                                            className='movies-detailes'
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div>
                                                <p>{session.id}_</p>
                                                <h2>{session.title}</h2>
                                            </div>
                                            <div>
                                                <span>{session.time}</span>
                                                <span className='movie-icon'><FaRegCirclePlay /></span>
                                                {
                                                    session.free === 0 || isRegistered ? null : <CiLock /> 
                                                }
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='comments'>
                    <div className='comments-top'>
                        <h1 className='title'>نظرات</h1>
                    </div>

                    {
                        isRegistered ? (
                            <>
                                <div className='create-comment'>

                                    <div className='crate-comment-user-info'>
                                        <div>
                                            <img src="/images/courses/youtuber.png" alt="" />
                                        </div>
                                        <div>
                                            <h3>{authContext.userInfos?.user?.name} | کاربر</h3>
                                            <p>23/2/2002</p>
                                        </div>
                                    </div>

                                    <div className='create-comment-body'>
                                        <textarea
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            rows="5"
                                        />
                                        <div className='mb-5 comment-score'>
                                            <h2>امتیاز شما :</h2>
                                            <select value={score} onChange={(e) => setScore(+e.target.value)}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <div className='comment_btn_wrapper'> 
                                            <button className='comment-btn comment-btn-success' onClick={sendComment}>ارسال</button>
                                            <button className='comment-btn comment-btn-danger' onClick={cansleComment}>لغو</button>
                                        </div>
                                    </div>

                                </div>


                            </>
                        ) : (
                            <div className='noRegister-div'>
                                <h3>
                                    برای نظر دادن ابتدا باید در دوره ثبت نام کنید
                                </h3>
                            </div>
                        )
                    }

                    <div className='comment-body'>
                        {comments.map(comment => (
                            <div className='comment-item' key={comment._id}>
                                <div className='comment-user-info'>
                                    <div>
                                        <img src="/images/courses/youtuber.png" alt="" />
                                    </div>
                                    <div>
                                        <h3>{comment?.creator?.name} | کاربر</h3>
                                        <p>23/2/2002</p>
                                    </div>
                                </div>

                                <div className='comment-user-body'>
                                    <p>{comment?.body}</p>
                                </div>

                                {comment.answers?.length > 0 && (
                                    <div className='comment-admin'>
                                        <div className='comment-user-info'>
                                            <div className='icon-wrapper'>
                                                <IoPersonOutline />
                                            </div>
                                            <div>
                                                <h3>{comment.answers[0].creator?.name} | ادمین</h3>
                                                <p>{new Date(comment.answers[0].createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className='comment-user-body'>
                                            <p>{comment.answers[0].body}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                </div>

            </div>

            <Footer />

        </div>
    )
}



