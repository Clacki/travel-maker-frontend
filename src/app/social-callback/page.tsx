import { redirect } from 'next/navigation'

type SocialCallbackPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SocialCallbackPage({
  searchParams,
}: SocialCallbackPageProps) {
  const params = await searchParams
  const nextParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => nextParams.append(key, item))
      return
    }

    if (value) {
      nextParams.set(key, value)
    }
  })

  const queryString = nextParams.toString()

  redirect(`/auth/callback${queryString ? `?${queryString}` : ''}`)
}
