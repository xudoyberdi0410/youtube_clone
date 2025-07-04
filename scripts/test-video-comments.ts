// scripts/test-video-comments.ts

import { ApiClient } from '../src/lib/api-client'

async function testVideoComments() {
  try {
    console.log('🧪 Testing video comments API...')
    
    const apiClient = ApiClient.getInstance()
    
    // Тестируем с video_id = 1
    console.log('\n🎥 Fetching comments for video ID: 1')
    const videoComments = await apiClient.getVideoComments('1')
    console.log(`✅ Found ${videoComments.length} comments for video ID 1`)
    
    if (videoComments.length > 0) {
      console.log('\n📝 Sample comment:')
      console.log(JSON.stringify(videoComments[0], null, 2))
      
      console.log('\n📝 All comments:')
      videoComments.forEach((comment, index) => {
        console.log(`${index + 1}. ${comment.channel_name}: "${comment.comment}" (${comment.created_at})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error testing video comments:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
  }
}

testVideoComments()
