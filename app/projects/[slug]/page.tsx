import { redirect } from 'next/navigation'
import { projects } from '../../_data/projects'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function OldProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/en/projects/${slug}`)
}
