import { PageLayout } from '@/components/layout/PageLayout'

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <PageLayout>Detail Page - {id}</PageLayout>
}
