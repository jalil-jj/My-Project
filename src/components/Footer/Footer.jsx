import React, { useState } from 'react'
import './Footer.css'
import swal from 'sweetalert'

export default function Footer() {

  const [body, setBody] = useState('')

  function addNewsLetterHandler() {
    if (!body.trim()) {
      swal({
        title: 'لطفاً یک ایمیل وارد کنید.',
        icon: 'warning',
        button: 'باشه'
      });
      return;
    }

    fetch('http://localhost:4000/v1/newsLetter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: body.trim() })
    })
      .then(res => res.json())
      .then(data => {
        swal({
          title: 'با موفقیت ثبت نام شدید.',
          icon: 'success',
          button: 'دمت گرم'
        });
        setBody('');
      })
      .catch(err => {
        swal({
          title: 'خطا در ثبت‌نام!',
          text: err.message || 'مشکلی پیش آمده.',
          icon: 'error',
          button: 'باشه'
        });
      });
  }





  return (
    <div className="container">
      <div className='footer'>
        <div className='row'>

          <div className='col-12 col-md-6 col-lg-4'>
            <h2 className='footer-title'>درباره ما</h2>
            <p className='about-txt'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته </p>
          </div>

          <div className='col-12 col-md-6 col-lg-4'>
            <h2 className='footer-title'>آخرین مطالب</h2>
            <ul className='last-news_menu'>
              <li>
                <a href="#">
                  معرفی بهترین سایت آموزش جاوا اسکریپت [ تجربه محور ] + آموزش رایگان
                </a>
              </li>
              <li>
                <a href="#">
                  معرفی بهترین سایت آموزش جاوا اسکریپت [ تجربه محور ] + آموزش رایگان
                </a>
              </li>
              <li>
                <a href="#">
                  معرفی بهترین سایت آموزش جاوا اسکریپت [ تجربه محور ] + آموزش رایگان
                </a>
              </li>
              <li>
                <a href="#">
                  معرفی بهترین سایت آموزش جاوا اسکریپت [ تجربه محور ] + آموزش رایگان
                </a>
              </li>
              <li>
                <a href="#">
                  معرفی بهترین سایت آموزش جاوا اسکریپت [ تجربه محور ] + آموزش رایگان
                </a>
              </li>
            </ul>
          </div>

          <div className='col-12 col-md-6 col-lg-4'>
            <h2 className='footer-title'>دسترسی سریع</h2>
            <ul className='fast-menu'>
              <li>
                <a href="#">آموزش Html</a>
              </li>
              <li>
                <a href="#">آموزش Html</a>
              </li>
              <li>
                <a href="#">آموزش Html</a>
              </li>
              <li>
                <a href="#">آموزش Html</a>
              </li>
              <li>
                <a href="#">آموزش Html</a>
              </li>
            </ul>

            <div className='news-letter'>
              <h2 className='footer-title'>اشتراک در خبرنامه</h2>
              <p className='news-letter-txt'>جهت اطلاع از اخبار ،<br /> عضو شوید</p>
              <div className='newsletter-container'>
                <input onChange={(e) => setBody(e.target.value)} value={body} type="text" placeholder='ایمیل' />
                <button onClick={addNewsLetterHandler}>عصویت</button>
              </div>
            </div>

          </div>

        </div>
        <div className='botton-title'>
          <p>کلیه حقوق برای آکادمی آموزش برنامه نویسی <strong>من</strong> محفوظ است.</p>
        </div>
      </div>
    </div>
  )
}
