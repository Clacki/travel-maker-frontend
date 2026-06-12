import { ResultClientLayer } from './ResultClientLayer'

interface ResultPageProps {
  sharedTypeKey?: string
}

export async function ResultPage({ sharedTypeKey }: ResultPageProps) {
  return <ResultClientLayer sharedTypeKey={sharedTypeKey} />
}
