import type { Project } from './projects'

// The dictionary is a union across locales; we only read these two optional maps.
type ContentDict = {
  projectContent?: Record<string, Partial<Project> & { features?: string[] }>
  statusLabels?: Record<string, string>
}

// Returns a copy of the project with localizable prose fields swapped for the
// active language's content (falls back to the English fields in projects.ts).
export function localizeProject(project: Project, dict: ContentDict): Project {
  const c = dict.projectContent?.[project.slug]
  if (!c) return project
  return {
    ...project,
    tagline: c.tagline ?? project.tagline,
    description: c.description ?? project.description,
    longDescription: c.longDescription ?? project.longDescription,
    type: c.type ?? project.type,
    priceFrom: c.priceFrom ?? project.priceFrom,
    location: c.location ?? project.location,
    landArea: c.landArea ?? project.landArea,
    poolSize: c.poolSize ?? project.poolSize,
    features: c.features ?? project.features,
  }
}

// Localized label for the status pill (the raw status stays the styling key).
export function statusLabel(status: string, dict: ContentDict): string {
  return dict.statusLabels?.[status] ?? status
}
