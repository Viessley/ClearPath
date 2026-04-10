import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userId = params.get('userId')
    const nickname = params.get('nickname')

    if (token && userId) {
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('nickname', nickname)
      navigate('/')
    } else {
      navigate('/auth')
    }
  }, [])

  return (
    <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Signing you in...</p>
    </div>
  )
}