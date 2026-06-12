'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, User } from 'lucide-react'
import { css } from '@/styled-system/css'
import { Button } from '@/components/common/button'
import { LoadingState } from '@/components/common/status'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'
import {
  checkNickname,
  getProfileImagePresignedUrl,
  updateMyProfile,
  uploadProfileImageToPresignedUrl,
} from '@/features/mypage/api/profileApi'
import {
  mapProfileTagIdsToApiTagIds,
  mapProfileTagIdsToUserTags,
  PROFILE_TAG_LIMIT,
  profileInterestTags,
} from '../../lib/profile-tags'
import {
  getDefaultEditableProfile,
  useProfileStore,
} from '@/store/profileStore'

interface ProfileEditContentProps {
  userId: string
}

const ALLOWED_PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024

const containerStyle = css({
  maxW: '720px',
  mx: 'auto',
  px: { base: '4', md: '6' },
  py: { base: '6', md: '8' },
})

const avatarSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3',
  mb: '10',
})

const avatarWrapStyle = css({
  position: 'relative',
  width: '100px',
  height: '100px',
})

const avatarStyle = css({
  width: 'full',
  height: 'full',
  borderRadius: 'pill',
  borderWidth: '2px',
  borderColor: 'primary',
  bg: 'bg.muted',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text.secondary',
})

const avatarImageStyle = css({
  width: 'full',
  height: 'full',
  objectFit: 'cover',
})

const hiddenFileInputStyle = css({
  srOnly: true,
})

const avatarEditButtonStyle = css({
  position: 'absolute',
  right: '0',
  bottom: '0',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8',
  height: '8',
  borderRadius: 'pill',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  bg: 'bg.surface',
  color: 'text.primary',
  boxShadow: 'sm',
  cursor: 'pointer',
  transitionProperty: 'background-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.soft',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const avatarIconStyle = css({
  width: '40px',
  height: '40px',
})

const typeNameStyle = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  color: 'text.primary',
})

const bioPreviewStyle = css({
  maxW: '420px',
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
  textAlign: 'center',
})

const typeTagRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2',
})

const typeTagStyle = css({
  px: '2',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'medium',
})

const statusTextStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  textAlign: 'center',
})

const errorTextStyle = css({
  mt: '1',
  fontSize: 'xs',
  color: 'warning',
})

const successTextStyle = css({
  mt: '1',
  fontSize: 'xs',
  color: 'success',
})

const sectionStyle = css({
  mb: '8',
})

const sectionTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'text.primary',
  mb: '4',
})

const sectionDescStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  mb: '3',
})

const labelStyle = css({
  display: 'block',
  fontSize: 'xs',
  color: 'text.secondary',
  mb: '1',
})

const fieldPanelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  bg: 'bg.surface',
  borderRadius: 'md',
  px: { base: '4', md: '6' },
  py: { base: '5', md: '6' },
  boxShadow: 'sm',
})

const inputRowStyle = css({
  display: 'flex',
  gap: '2',
})

const inputStyle = css({
  flex: '1',
  minW: 0,
  px: '3',
  py: '2',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'md',
  _placeholder: {
    color: 'text.secondary',
  },
  _focusVisible: {
    outline: 'none',
    borderColor: 'primary',
    boxShadow: 'focus',
  },
})

const textareaStyle = css({
  width: 'full',
  minH: '24',
  resize: 'vertical',
  px: '3',
  py: '2',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'md',
  lineHeight: 'normal',
  _placeholder: {
    color: 'text.secondary',
  },
  _focusVisible: {
    outline: 'none',
    borderColor: 'primary',
    boxShadow: 'focus',
  },
})

const tagGridStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tagButtonStyle = css({
  px: '3',
  py: '2',
  borderRadius: 'pill',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'sm',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, color, opacity',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.45,
    _hover: {
      borderColor: 'border.subtle',
      color: 'text.primary',
    },
  },
})

const tagButtonActiveStyle = css({
  px: '3',
  py: '2',
  borderRadius: 'pill',
  borderWidth: '1px',
  borderColor: 'primary',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'sm',
  fontWeight: 'medium',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, color',
  transitionDuration: '150ms',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const footerStyle = css({
  display: 'flex',
  gap: '3',
  mt: '8',
})

export function ProfileEditContent({ userId }: ProfileEditContentProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile)
  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const savedProfile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )
  const saveProfile = useProfileStore((state) => state.saveProfile)

  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState(savedProfile.bio)
  const [selectedTags, setSelectedTags] = useState(savedProfile.tagIds)
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable' | 'error'
  >('idle')
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState('')
  const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState<
    string | null
  >(null)
  const [imageUploadStatus, setImageUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [imageUploadError, setImageUploadError] = useState('')
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'submitting' | 'error'
  >('idle')
  const [submitError, setSubmitError] = useState('')

  const savedProfileTags = mapProfileTagIdsToUserTags(savedProfile.tagIds)
  const isTagLimitReached = selectedTags.length >= PROFILE_TAG_LIMIT
  const currentNickname = userProfile?.nickname ?? savedProfile.nickname
  const currentProfileImageUrl =
    profileImagePreviewUrl || userProfile?.profileImageUrl || ''
  const nextNickname = nickname.trim() || currentNickname
  const isNicknameChanged = nextNickname !== currentNickname
  const isNicknameCheckRequired =
    isNicknameChanged && nicknameStatus !== 'available'
  const isSubmitDisabled =
    imageUploadStatus === 'uploading' ||
    imageUploadStatus === 'error' ||
    submitStatus === 'submitting' ||
    nicknameStatus === 'checking' ||
    isNicknameCheckRequired ||
    !nextNickname ||
    selectedTags.length === 0

  useEffect(() => {
    if (!isAuthInitialized) {
      return
    }

    if (!isLoggedIn) {
      router.replace('/?showLogin=true')
    }
  }, [isAuthInitialized, isLoggedIn, router])

  if (!isAuthInitialized) {
    return <LoadingState />
  }

  if (!isLoggedIn) {
    return null
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((t) => t !== tagId)
      }

      if (prev.length >= PROFILE_TAG_LIMIT) {
        return prev
      }

      return [...prev, tagId]
    })
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
    setNicknameStatus('idle')
    setSubmitStatus('idle')
    setSubmitError('')
  }

  const handleCheckDuplicate = async () => {
    const trimmed = nickname.trim()
    if (!trimmed) return

    setNicknameStatus('checking')
    try {
      const { available } = await checkNickname(trimmed)
      setNicknameStatus(available ? 'available' : 'unavailable')
    } catch {
      setNicknameStatus('error')
    }
  }

  const handleProfileImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file) {
      return
    }

    setImageUploadError('')
    setSubmitError('')
    setSubmitStatus('idle')
    setUploadedProfileImageUrl(null)

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setImageUploadStatus('error')
      setImageUploadError('이미지는 JPG, PNG, WEBP 형식만 사용할 수 있어요.')
      return
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageUploadStatus('error')
      setImageUploadError('이미지는 5MB 이하로 선택해 주세요.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setProfileImagePreviewUrl(objectUrl)
    setImageUploadStatus('uploading')

    try {
      const presigned = await getProfileImagePresignedUrl({
        file_name: file.name,
      })

      await uploadProfileImageToPresignedUrl({
        file,
        presignedUrl: presigned.presigned_url,
        contentType: presigned.content_type || file.type,
      })

      setUploadedProfileImageUrl(presigned.img_url)
      setProfileImagePreviewUrl(presigned.img_url)
      setImageUploadStatus('success')
    } catch {
      setProfileImagePreviewUrl('')
      setImageUploadStatus('error')
      setImageUploadError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleSave = async () => {
    if (isSubmitDisabled) {
      if (isNicknameCheckRequired) {
        setSubmitError('닉네임 중복 확인을 완료해 주세요.')
      }
      return
    }

    const nextProfile = {
      nickname: nextNickname,
      bio: bio.trim(),
      tagIds: selectedTags,
    }

    setSubmitStatus('submitting')
    setSubmitError('')

    try {
      const updatedProfile = await updateMyProfile({
        nickname: nextProfile.nickname,
        bio: nextProfile.bio,
        tags: mapProfileTagIdsToApiTagIds(nextProfile.tagIds),
        ...(uploadedProfileImageUrl
          ? { profile_img_url: uploadedProfileImageUrl }
          : {}),
      })

      saveProfile(userId, nextProfile)
      setUserProfile({
        id: userProfile?.id ?? userId,
        nickname: updatedProfile.nickname,
        email: userProfile?.email,
        bio: updatedProfile.bio,
        profileImageUrl: updatedProfile.profile_img_url,
        followerCount: userProfile?.followerCount,
        followingCount: userProfile?.followingCount,
        bookmarkCount: userProfile?.bookmarkCount,
        reviewCount: userProfile?.reviewCount,
      })
      void loadCurrentUserProfile()
      router.push(`/profile/${userId}`)
    } catch {
      setSubmitStatus('error')
      setSubmitError('프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className={containerStyle}>
      <div className={avatarSectionStyle}>
        <div className={avatarWrapStyle}>
          <div className={avatarStyle}>
            {currentProfileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentProfileImageUrl}
                alt="프로필 이미지 미리보기"
                className={avatarImageStyle}
              />
            ) : (
              <User className={avatarIconStyle} aria-hidden="true" />
            )}
          </div>
          <button
            type="button"
            className={avatarEditButtonStyle}
            aria-label="프로필 이미지 수정"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploadStatus === 'uploading'}
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_PROFILE_IMAGE_TYPES.join(',')}
            className={hiddenFileInputStyle}
            onChange={(e) => void handleProfileImageSelect(e)}
          />
        </div>
        {imageUploadStatus === 'uploading' && (
          <p className={statusTextStyle}>이미지를 업로드하는 중입니다.</p>
        )}
        {imageUploadStatus === 'error' && (
          <p className={errorTextStyle}>{imageUploadError}</p>
        )}
        <span className={typeNameStyle}>
          {userProfile?.nickname ?? savedProfile.nickname}
        </span>
        {savedProfile.bio && (
          <p className={bioPreviewStyle}>{savedProfile.bio}</p>
        )}
        <div className={typeTagRowStyle}>
          {savedProfileTags.map((tag) => (
            <span key={tag.id} className={typeTagStyle}>
              #{tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className={sectionStyle}>
        <h2 className={sectionTitleStyle}>기본 정보</h2>
        <div className={fieldPanelStyle}>
          <div>
            <label className={labelStyle} htmlFor="profile-nickname">
              닉네임
            </label>
            <div className={inputRowStyle}>
              <input
                id="profile-nickname"
                type="text"
                className={inputStyle}
                value={nickname}
                onChange={handleNicknameChange}
                maxLength={20}
                placeholder="닉네임을 입력하세요"
              />
              <Button
                variant="outline"
                shape="rounded"
                onClick={() => void handleCheckDuplicate()}
                disabled={nicknameStatus === 'checking' || !nickname.trim()}
              >
                {nicknameStatus === 'checking' ? '확인 중...' : '중복 확인'}
              </Button>
            </div>
            {nicknameStatus === 'available' && (
              <p className={successTextStyle}>사용 가능한 닉네임입니다.</p>
            )}
            {nicknameStatus === 'unavailable' && (
              <p className={errorTextStyle}>이미 사용 중인 닉네임입니다.</p>
            )}
            {nicknameStatus === 'error' && (
              <p className={errorTextStyle}>
                확인 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            )}
          </div>

          <div>
            <label className={labelStyle} htmlFor="profile-bio">
              한줄소개
            </label>
            <textarea
              id="profile-bio"
              className={textareaStyle}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={50}
              placeholder="한줄소개를 입력하세요"
            />
          </div>
        </div>
      </div>

      <div className={sectionStyle}>
        <h2 className={sectionTitleStyle}>관심 태그</h2>
        <p className={sectionDescStyle}>
          관심 있는 여행 키워드를 최대 {PROFILE_TAG_LIMIT}개까지 선택하세요.
        </p>
        <div className={tagGridStyle}>
          {profileInterestTags.map((tag) => {
            const isActive = selectedTags.includes(tag.id)
            const isDisabled = !isActive && isTagLimitReached

            return (
              <button
                key={tag.id}
                type="button"
                className={isActive ? tagButtonActiveStyle : tagButtonStyle}
                onClick={() => handleTagToggle(tag.id)}
                aria-pressed={isActive}
                disabled={isDisabled}
              >
                {tag.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={footerStyle}>
        <Button variant="neutral" shape="pill" fullWidth onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant="primary"
          shape="pill"
          fullWidth
          onClick={() => void handleSave()}
          disabled={isSubmitDisabled}
        >
          {submitStatus === 'submitting'
            ? '프로필을 저장하는 중입니다.'
            : '저장하기'}
        </Button>
      </div>
      {submitError && <p className={errorTextStyle}>{submitError}</p>}
    </div>
  )
}
