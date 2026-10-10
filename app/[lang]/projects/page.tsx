import { redirect } from 'next/navigation'

// Nie ma osobnej listy inwestycji — projekty to sekcja strony głównej.
// Adres /{lang}/projects był w sitemapie i zwracał 404.
export default async function ProjectsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  redirect(`/${lang}/#projects`)
}
