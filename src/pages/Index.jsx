import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar/Topbar';
import Footer from '../components/Footer/Footer';
import CourseBox from '../components/CourseBox/CourseBox';
import ArticleBox from './../components/ArticleBox/ArticleBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import './index.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import Loader from '../components/Loader/Loader';

export default function Index() {
    const [courses, setCourses] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllCourses(), getAllArticles()]).then(() => {
            setLoading(false);
        });
    }, []);

    function getAllCourses() {
        return fetch('http://localhost:4000/v1/courses')
            .then(res => res.json())
            .then(data => setCourses(data));
    }

    function getAllArticles() {
        return fetch('http://localhost:4000/v1/article')
            .then(res => res.json())
            .then(data => setArticles(data));
    }

    if (loading) return <Loader />;

    return (
        <div>
            <div className='container'>
                <Topbar />


                <div>
                    <h2 className='title'>دوره</h2>

                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        freeMode={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={3000}
                        loop={true}
                        modules={[FreeMode, Pagination , Autoplay]}
                        className="mySwiper"
                    >
                        {courses.map(course => (
                            <SwiperSlide key={course.id}>
                                <CourseBox {...course} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>



                <div className='article-wrapper'>
                    <h2 className='title'>مقاله ها</h2>
                    <div className='row mt-5'>
                        {articles.map(article => (
                            <ArticleBox key={article.id} {...article} />
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
