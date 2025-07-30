import React, { useEffect, useState } from "react";
import "./ArticlesDetailes.css";
import ArticleBox from "../../components/ArticleBox/ArticleBox";
import Topbar from "../../components/Topbar/Topbar";
import Footer from "../../components/Footer/Footer";

import { FaRegUser } from "react-icons/fa6";
import { BsCalendar2Date } from "react-icons/bs";
import { FaDiscourse } from "react-icons/fa6";

import axios from "axios";
import { useParams } from "react-router-dom";

export default function ArticlesDetailes() {
  const { shortName } = useParams();
  const [article, setArticle] = useState({ body: "", covers: [] });
  const [articles , setArticles] = useState([])

  useEffect(() => {
    getOneArticle();
    getAllArticles()

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [shortName]);

  function getOneArticle() {
    axios
      .get(`http://localhost:4000/v1/article/${shortName}`)
      .then((res) =>
        setArticle({ ...res.data, covers: res.data.covers || [] })
      )
      .catch((err) => console.error(err));
  }

  function getAllArticles () {
    axios.get("http://localhost:4000/v1/article")
    .then(res => setArticles(res.data))
  }


  // تابع برای جایگذاری عکس‌ها به جای [IMAGE_HERE] داخل متن
  function renderWithImages(content, images) {
    if (!content) return null;
    const parts = content.split("[IMAGE_HERE]");
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        <div dangerouslySetInnerHTML={{ __html: part }} />
        {index < images.length && (
          <img
            src={`http://localhost:4000/courses/covers/${images[index]}`}
            alt={`تصویر مقاله شماره ${index + 1}`}
            className="article-image"
            style={{ maxWidth: "100%", margin: "20px 0" }}
          />
        )}
      </React.Fragment>
    ));
  }

  if (!article.body) return <p>در حال بارگذاری...</p>;

  return (
    <div className="articlesdetailes">
      <div className="container">
        <Topbar />

        <h1 className="title">{article.title}</h1>

        <div className="details-blog">
          <div>
            <span>{article?.creator?.name || "ناشناس"}</span>
            <FaRegUser />
          </div>
          <div>
            <span>
              {article?.createdAt
                ? article.createdAt.slice(0, 10)
                : "تاریخ موجود نیست"}
            </span>
            <BsCalendar2Date />
          </div>
        </div>

        <div className="parts-detailes">
          {renderWithImages(article.body, article.covers)}
        </div>


        <div className="seggust">
          <span className="title">پیشنهاد مطالعه</span>
          <div className="row">
            {
              articles.map(item => (
                <ArticleBox {...item}/>
              ))
            }
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
