export type DataSource = 'mock' | 'api'

const configuredDataSource = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim()

export const dataSource: DataSource =
  configuredDataSource === 'api' || configuredDataSource === 'mock'
    ? configuredDataSource
    : process.env.NEXT_PUBLIC_API_URL?.trim()
      ? 'api'
      : 'mock'

export const isMockDataSource = dataSource === 'mock'

export const isMswEnabled =
  process.env.NEXT_PUBLIC_MSW_ENABLED === 'true' &&
  process.env.NODE_ENV !== 'production'
