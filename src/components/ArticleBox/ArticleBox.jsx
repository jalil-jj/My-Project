import React from 'react'
import './ArticleBox.css'
import { NavLink } from 'react-router-dom';

export default function ArticleBox(props) {
    return (
        <>
            <div className='col-12 col-sm-6 col-md-4 mt-5'>
                <div className="card">
                    {props.covers?.length > 0 && (
                        <img
                            src={`http://localhost:4000/courses/covers/${props.covers[0]}`}
                            alt="تصویر مقاله"
                            className="card-img-top"
                        />
                    )}
                    <div className="card-body">
                        <h5 className="card-title">{props.title}</h5>
                        <p className="card-text">
                            {props.description}
                        </p>
                        <NavLink to={`/articles/${props.href}`} className="btn btn-primary">
                            رفتن به مقاله
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
