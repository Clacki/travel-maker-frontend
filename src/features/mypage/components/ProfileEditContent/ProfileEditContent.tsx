'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, User } from 'lucide-react'
import { css } from '@/styled-system/css'
import { Button } from '@/components/common/button'
import {
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
  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const savedProfile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )
  const saveProfile = useProfileStore((state) => state.saveProfile)

  // TODO: 실제 API 연동
  const [nickname, setNickname] = useState(savedProfile.nickname)
  const [bio, setBio] = useState(savedProfile.bio)
  const [selectedTags, setSelectedTags] = useState(savedProfile.tagIds)

  const savedProfileTags = mapProfileTagIdsToUserTags(savedProfile.tagIds)
  const isTagLimitReached = selectedTags.length >= PROFILE_TAG_LIMIT

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

  const handleCheckDuplicate = () => {
    console.log('check duplicate', nickname)
    // TODO: 닉네임 중복 확인 API 호출
  }

  const handleSave = () => {
    const nextProfile = {
      nickname: nickname.trim() || savedProfile.nickname,
      bio: bio.trim(),
      tagIds: selectedTags,
    }

    console.log('save', nextProfile)
    // TODO: 프로필 수정 API 호출
    saveProfile(userId, nextProfile)
    router.push(`/profile/${userId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className={containerStyle}>
      <div className={avatarSectionStyle}>
        <div className={avatarWrapStyle}>
          <div className={avatarStyle}>
            <User className={avatarIconStyle} aria-hidden="true" />
          </div>
          <button
            type="button"
            className={avatarEditButtonStyle}
            aria-label="프로필 이미지 수정"
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
        </div>
        <span className={typeNameStyle}>{savedProfile.nickname}</span>
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
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                placeholder="닉네임을 입력하세요"
              />
              <Button
                variant="outline"
                shape="rounded"
                onClick={handleCheckDuplicate}
              >
                중복 확인
              </Button>
            </div>
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
        <Button variant="primary" shape="pill" fullWidth onClick={handleSave}>
          저장하기
        </Button>
      </div>
    </div>
  )
}
