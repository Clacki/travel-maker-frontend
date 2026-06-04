import { PageLayout } from '@/components/layout/PageLayout'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params

  return <PageLayout>Detail Page - {id}</PageLayout>
}
