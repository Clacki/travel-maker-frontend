import { ResultPage } from './_components/ResultPage'

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
  return <ResultPage sharedTypeKey={effectiveTypeKey} sharedVector={vector} />
}
