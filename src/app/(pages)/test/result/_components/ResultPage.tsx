import { ResultClientLayer } from './ResultClientLayer'

interface ResultPageProps {
  sharedTypeKey?: string
  sharedVector?: string
}

export async function ResultPage({
  sharedTypeKey,
  sharedVector,
}: ResultPageProps) {
  return (
    <ResultClientLayer
      sharedTypeKey={sharedTypeKey}
      sharedVector={sharedVector}
    />
  )
}
