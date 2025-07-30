import React, { useContext } from 'react'
import AuthContext from '../../Contex/authContex'
import { Navigate } from 'react-router-dom'

export default function Private({ children }) {
  const { userInfos, logedIn } = useContext(AuthContext)


  // حالت اولیه: هنوز اطلاعات کاربر نرسیده
  if (!logedIn && !userInfos?.user?.role) {
    return <p>در حال بررسی دسترسی...</p>  // یا لودینگ اسپینر
  }

  // اگر نقش ADMIN داشت
  if (userInfos?.user?.role === 'ADMIN') {
    return <>{children}</>
  }

  // اگر نقش نداشت یا لاگین نبود
  return <Navigate to="/login" replace />
}
