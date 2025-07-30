import React from 'react'
import './CourseBox.css'
import { NavLink } from 'react-router-dom';

export default function CourseBox({ name, description, cover, href }) {
    return (
        <>
            <div className="col-12 mt-5">
                <div className="card">
                    <img src={`http://localhost:4000/courses/covers/${cover}`} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">
                            {description}
                        </p>
                        <NavLink to={`/courses/${href}`} className="btn btn-primary">
                            رفتن به دوره
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
