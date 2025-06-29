'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { testProxy } from '@/lib/test-proxy'

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login...')
    
    try {
      const response = await apiClient.login({
        username: 'alisher@gmail.com',
        password: 'alisher'
      })
      
      setResult(`✅ Login successful! Token: ${response.access_token.substring(0, 50)}...`)
      
      // Сохраняем токен и тестируем получение пользователя
      localStorage.setItem('access_token', response.access_token)
      
      setTimeout(async () => {
        try {
          const user = await apiClient.getUser()
          setResult(prev => prev + `\n✅ Get user successful! User: ${JSON.stringify(user)}`)
        } catch (error) {
          setResult(prev => prev + `\n❌ Get user failed: ${error}`)
        }
      }, 1000)
      
    } catch (error) {
      setResult(`❌ Login failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testProxyFunction = async () => {
    setLoading(true)
    setResult('Testing proxy...')
    
    try {
      await testProxy()
      setResult('✅ Check console for proxy test results')
    } catch (error) {
      setResult(`❌ Proxy test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testLikes = async () => {
    setLoading(true)
    setResult('Testing likes...')
    
    try {
      // Сначала получаем видео
      const videos = await apiClient.getVideos()
      if (videos.length === 0) {
        setResult('❌ No videos found')
        return
      }
      
      const video = videos[0]
      setResult(`Testing likes for video: ${video.title}\nInitial like_amount: ${video.like_amount}`)
      
      // Добавляем лайк
      const likeData = {
        video_id: video.id,
        is_like: true
      }
      
      const newLike = await apiClient.addLike(likeData)
      setResult(prev => prev + `\n✅ Like added! Like ID: ${newLike.id}`)
      
      // Снова получаем видео, чтобы проверить обновленный like_amount
      setTimeout(async () => {
        try {
          const updatedVideos = await apiClient.getVideos()
          const updatedVideo = updatedVideos.find(v => v.id === video.id)
          setResult(prev => prev + `\n✅ Updated like_amount: ${updatedVideo?.like_amount}`)
          
          // Удаляем лайк для очистки
          setTimeout(async () => {
            try {
              await apiClient.deleteLike(newLike.id)
              setResult(prev => prev + `\n✅ Like removed for cleanup`)
            } catch (error) {
              setResult(prev => prev + `\n⚠️ Failed to remove like: ${error}`)
            }
          }, 1000)
          
        } catch (error) {
          setResult(prev => prev + `\n❌ Failed to get updated video: ${error}`)
        }
      }, 1000)
      
    } catch (error) {
      setResult(`❌ Likes test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectAPI = async () => {
    setLoading(true)
    setResult('Testing direct API...')
    
    try {
      const response = await fetch('https://youtube-jfmi.onrender.com/', {
        method: 'GET'
      })
      
      if (response.ok) {
        setResult('✅ Direct API connection successful!')
      } else {
        setResult(`❌ Direct API failed: ${response.status}`)
      }
    } catch (error) {
      setResult(`❌ Direct API failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API & Proxy Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Proxy Status</h2>
          <p>Proxy enabled: <strong>{process.env.NEXT_PUBLIC_USE_PROXY}</strong></p>
          <p>API URL: <strong>{process.env.NEXT_PUBLIC_API_URL}</strong></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Test Direct API
        </button>
        
        <button
          onClick={testProxyFunction}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Test Proxy
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          Test Login
        </button>
        
        <button
          onClick={testLikes}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          Test Likes
        </button>
      </div>
      
      {loading && (
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Quick Commands:</h3>
        <p className="text-sm">Open browser console and run:</p>
        <code className="block bg-gray-800 text-green-400 p-2 rounded mt-2">
          testProxy() // Test proxy functionality
        </code>
      </div>
    </div>
  )
}
