import headJson from '@/data/head.json';
import homeJson from '@/data/home.json';
import aboutJson from '@/data/about.json';
import projectsJson from '@/data/projects.json';
import certificationsJson from '@/data/certifications.json';
import experiencesJson from '@/data/experiences.json';

export type SectionKey = 'head' | 'home' | 'about' | 'projects' | 'certifications' | 'experiences';

const staticSections: Record<SectionKey, unknown> = {
  head: headJson,
  home: homeJson,
  about: aboutJson,
  projects: projectsJson,
  certifications: certificationsJson,
  experiences: experiencesJson,
};

/** Devuelve la sección desde los JSON de src/data (sin integraciones externas). */
export function getStaticSection<T = unknown>(key: SectionKey): T {
  return staticSections[key] as T;
}

/** Alias de getStaticSection para compatibilidad. */
export async function getSection<T = unknown>(key: SectionKey): Promise<T> {
  return staticSections[key] as T;
}
