export type DataSource = 'mock' | 'api'

const configuredDataSource = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim()
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

if (
  configuredDataSource &&
  configuredDataSource !== 'api' &&
  configuredDataSource !== 'mock'
) {
  throw new Error(
    `Invalid NEXT_PUBLIC_DATA_SOURCE: "${configuredDataSource}". Expected "mock" or "api".`
  )
}

export const dataSource: DataSource =
  configuredDataSource === 'api' || configuredDataSource === 'mock'
    ? configuredDataSource
    : configuredApiUrl
      ? 'api'
      : 'mock'

if (dataSource === 'api') {
  if (!configuredApiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is required when NEXT_PUBLIC_DATA_SOURCE is "api".'
    )
  }

  let apiUrl: URL
  try {
    apiUrl = new URL(configuredApiUrl)
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTP(S) URL.')
  }

  if (apiUrl.protocol !== 'http:' && apiUrl.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_API_URL must use the HTTP or HTTPS protocol.')
  }
}

export const isMockDataSource = dataSource === 'mock'

export const isMswEnabled =
  process.env.NEXT_PUBLIC_MSW_ENABLED === 'true' &&
  process.env.NODE_ENV !== 'production'
