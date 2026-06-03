import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then(m => m.default),
  pl: () => import('../../dictionaries/pl.json').then(m => m.default),
  de: () => import('../../dictionaries/de.json').then(m => m.default),
}

export type Locale = keyof typeof dictionaries

export const locales: Locale[] = ['en', 'pl', 'de']
export const defaultLocale: Locale = 'pl'

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
