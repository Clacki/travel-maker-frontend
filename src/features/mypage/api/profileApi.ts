import api from '@/lib/api'
import type { PublicUserProfile } from '@/types/mypage.types'
import { isAxiosError } from 'axios'

export type ProfileImagePresignedUrlRequest = {
  file_name: string
}

export type ProfileImagePresignedUrlResponse = {
  presigned_url: string
  img_url: string
  key: string
  content_type: string
}

export type UpdateMyProfileRequest = {
  nickname?: string
  bio?: string
  tags?: number[]
  profile_image_url?: string
}

export type UpdatedMyProfileResponse = {
  nickname: string
  bio: string
  profile_img_url: string | null
  tags: {
    id: number
    name: string
  }[]
  created_at: string
  updated_at: string
}

export async function checkNickname(
  nickname: string
): Promise<{ available: boolean }> {
  try {
    await api.post<{ detail: string }>('/users/nickname/check', { nickname })
    return { available: true }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      return { available: false }
    }
    throw error
  }
}

export async function getPublicProfile(
  userId: number
): Promise<PublicUserProfile> {
  const response = await api.get<PublicUserProfile>(`/users/${userId}`)

  return response.data
}

export async function getProfileImagePresignedUrl(
  payload: ProfileImagePresignedUrlRequest
): Promise<ProfileImagePresignedUrlResponse> {
  const response = await api.patch<ProfileImagePresignedUrlResponse>(
    '/users/profile-image/presigned-url',
    payload
  )

  return response.data
}

export async function uploadProfileImageToPresignedUrl({
  file,
  presignedUrl,
  contentType,
}: {
  file: File
  presignedUrl: string
  contentType: string
}): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error('Profile image upload failed.')
  }
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest
): Promise<UpdatedMyProfileResponse> {
  const response = await api.patch<UpdatedMyProfileResponse>('/users', payload)

  return response.data
}
