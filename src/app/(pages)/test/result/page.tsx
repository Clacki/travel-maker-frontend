import { PageFadeIn } from '@/components/common/PageFadeIn'
import { ResultPage } from './_components/ResultPage'
import { css } from '@/styled-system/css'

const demoNoticeWrapperStyle = css({
  maxW: '7xl',
  mx: 'auto',
  px: { base: '4', md: '6' },
  pt: '4',
})

const demoNoticeStyle = css({
  width: 'fit-content',
  px: '3',
  py: '2',
  borderRadius: 'md',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  bg: 'bg.subtle',
  color: 'text.secondary',
  fontSize: 'xs',
})

export const metadata = {
  title: '여행 성향 결과 | TravelMaker',
}

type TestResultPageProps = {
  searchParams: Promise<{ type?: string; type_key?: string; vector?: string }>
}

export default async function TestResultPage({
  searchParams,
}: TestResultPageProps) {
  const { type, type_key, vector } = await searchParams
  const effectiveTypeKey = type_key ?? type
  return (
    <PageFadeIn>
      <>
        <div className={demoNoticeWrapperStyle}>
          <p className={demoNoticeStyle} role="note">
            포트폴리오 데모에서는 미리 구성된 결과 데이터를 사용합니다.
          </p>
        </div>
        <ResultPage sharedTypeKey={effectiveTypeKey} sharedVector={vector} />
      </>
    </PageFadeIn>
  )
}
