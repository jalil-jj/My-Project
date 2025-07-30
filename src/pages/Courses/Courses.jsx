import React  , {useEffect , useState} from 'react'
import { HiMagnifyingGlass } from "react-icons/hi2";
import './Courses.css'
import CourseBox from '../../components/CourseBox/CourseBox';
import Topbar from './../../components/Topbar/Topbar'
import Footer from './../../components/Footer/Footer'


export default function Courses() {


    const [courses, setCourses] = useState([])



    useEffect(() => {
        getAllCourses();
    }, []);


    function getAllCourses() {
        fetch('http://localhost:4000/v1/courses')
            .then(res => res.json())
            .then(data => {
                setCourses(data)
            }
            )
    }


    return (
        <div className='courses'>
            <Topbar />
            <div className='container'>

              

                <div>
                    <h2 className='title'>دوره ها</h2>
                    <div className='row mt-5'>
                        {
                            courses.map(course => (
                                <CourseBox {...course} />
                            ))
                        }
                    </div>
                </div>


            </div>

            <Footer />
        </div>
    )
}
