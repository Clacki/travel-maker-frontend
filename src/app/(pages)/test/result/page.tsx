import { ResultPage } from './_components/ResultPage'

export const metadata = {
  title: '여행 성향 결과 | TravelMaker',
}

type TestResultPageProps = {
  searchParams: Promise<{ type?: string }>
}

export default async function TestResultPage({
  searchParams,
}: TestResultPageProps) {
  const { type } = await searchParams
  return <ResultPage sharedTypeKey={type} />
}
