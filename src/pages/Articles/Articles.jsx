import React, { useEffect, useState } from 'react'
import './Articles.css'
import ArticleBox from './../../components/ArticleBox/ArticleBox'
import Topbar from './../../components/Topbar/Topbar'
import Footer from '../../components/Footer/Footer'
import axios from 'axios'

export default function Articles() {

    const [articles, setArticles] = useState([])

    useEffect(() => {
        getAllArticles()
    }, [])



    function getAllArticles() {
        axios.get('http://localhost:4000/v1/article')
            .then(res => setArticles(res.data))
            .catch(err => console.error(err));


    }



    return (
        <div className='articles'>
            <Topbar />
            <div className="container">

                <div>
                    <h2 className='title'>دوره ها</h2>
                    <div className='row mt-5'>
                        {
                            articles.map(article => (
                                <ArticleBox {...article} />
                            ))
                        }
                    </div>
                </div>

            </div>
            <Footer />

        </div>
    )
}
