const pad = (value: number): string => String(value).padStart(2, '0')

export const toIsoDate = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const parseVietnameseDate = (value: string): string | undefined => {
  const [datePart, timePart] = value.trim().split(' ')
  const [day, month, year] = datePart.split('/').map(Number)

  if (!day || !month || !year) {
    return undefined
  }

  const isoDate = `${year}-${pad(month)}-${pad(day)}`
  return timePart ? `${isoDate}T${timePart}` : isoDate
}

export const formatVietnameseDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

export const nowIso = (): string => new Date().toISOString()
