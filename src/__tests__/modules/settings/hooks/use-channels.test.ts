import { renderHook, act } from '@testing-library/react'
import { useChannels } from '@/modules/settings/hooks/use-channels'
import { apiClient } from '@/lib/api-client'

// Мокаем API клиент
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getMyChannels: jest.fn(),
    createChannel: jest.fn(),
    updateChannel: jest.fn(),
    updateChannelById: jest.fn(),
    deleteChannel: jest.fn(),
    deleteChannelById: jest.fn(),
    updateChannelProfileImage: jest.fn(),
    updateChannelProfileImageById: jest.fn(),
    updateChannelBannerImage: jest.fn(),
    updateChannelBannerImageById: jest.fn(),
  },
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('useChannels hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load channels on mount', async () => {
    const mockChannels = [
      {
        id: 1,
        name: 'Test Channel',
        description: 'Test Description',
        user_id: 1,
        created_at: '2023-01-01',
        subscribers_count: 100,
      },
    ]

    mockApiClient.getMyChannels.mockResolvedValue(mockChannels)

    const { result } = renderHook(() => useChannels())

    expect(result.current.loading).toBe(true)

    // Ждем, пока загрузка завершится
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.channels).toEqual(mockChannels)
    expect(result.current.selectedChannel).toEqual(mockChannels[0])
  })

  it('should handle empty channels list', async () => {
    mockApiClient.getMyChannels.mockResolvedValue([])

    const { result } = renderHook(() => useChannels())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.channels).toEqual([])
    expect(result.current.selectedChannel).toBeNull()
  })

  it('should create a new channel', async () => {
    const newChannel = {
      id: 2,
      name: 'New Channel',
      description: 'New Description',
      user_id: 1,
      created_at: '2023-01-02',
      subscribers_count: 0,
    }

    mockApiClient.getMyChannels.mockResolvedValue([])
    mockApiClient.createChannel.mockResolvedValue(newChannel)

    const { result } = renderHook(() => useChannels())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.createChannel({
        name: 'New Channel',
        description: 'New Description',
      })
    })

    expect(mockApiClient.createChannel).toHaveBeenCalledWith({
      name: 'New Channel',
      description: 'New Description',
    })
    expect(result.current.channels).toContain(newChannel)
    expect(result.current.selectedChannel).toEqual(newChannel)
  })

  it('should update a channel', async () => {
    const originalChannel = {
      id: 1,
      name: 'Original Channel',
      description: 'Original Description',
      user_id: 1,
      created_at: '2023-01-01',
      subscribers_count: 100,
    }

    const updatedChannel = {
      ...originalChannel,
      name: 'Updated Channel',
      description: 'Updated Description',
    }

    mockApiClient.getMyChannels.mockResolvedValue([originalChannel])
    mockApiClient.updateChannel.mockResolvedValue(updatedChannel)

    const { result } = renderHook(() => useChannels())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.updateChannel(1, {
        name: 'Updated Channel',
        description: 'Updated Description',
      })
    })

    expect(mockApiClient.updateChannel).toHaveBeenCalledWith({
      name: 'Updated Channel',
      description: 'Updated Description',
    })
    expect(result.current.selectedChannel).toEqual(updatedChannel)
  })

  it('should delete a channel', async () => {
    const channel1 = {
      id: 1,
      name: 'Channel 1',
      description: 'Description 1',
      user_id: 1,
      created_at: '2023-01-01',
      subscribers_count: 100,
    }

    const channel2 = {
      id: 2,
      name: 'Channel 2',
      description: 'Description 2',
      user_id: 1,
      created_at: '2023-01-02',
      subscribers_count: 50,
    }

    mockApiClient.getMyChannels.mockResolvedValue([channel1, channel2])
    mockApiClient.deleteChannelById.mockResolvedValue('Channel deleted')

    const { result } = renderHook(() => useChannels())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.deleteChannel(1)
    })

    expect(mockApiClient.deleteChannelById).toHaveBeenCalledWith(1)
    expect(result.current.channels).toHaveLength(1)
    expect(result.current.channels[0]).toEqual(channel2)
    expect(result.current.selectedChannel).toEqual(channel2)
  })

  it('should select a channel', async () => {
    const channel1 = {
      id: 1,
      name: 'Channel 1',
      description: 'Description 1',
      user_id: 1,
      created_at: '2023-01-01',
      subscribers_count: 100,
    }

    const channel2 = {
      id: 2,
      name: 'Channel 2',
      description: 'Description 2',
      user_id: 1,
      created_at: '2023-01-02',
      subscribers_count: 50,
    }

    mockApiClient.getMyChannels.mockResolvedValue([channel1, channel2])

    const { result } = renderHook(() => useChannels())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.selectedChannel).toEqual(channel1)

    act(() => {
      result.current.selectChannel(channel2)
    })

    expect(result.current.selectedChannel).toEqual(channel2)
  })
})
