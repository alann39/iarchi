'use client';

import type {ProjectCardData} from '@/lib/portfolio';

import {projectIcon} from '../fanIcons';

export interface ProjectFaceProps {
  project: ProjectCardData;
  index: number;
}

/** Blueprint card: orange typebar, code + year, per-card icon, title, tags. */
export function ProjectFace({project, index}: ProjectFaceProps) {
  const Icon = projectIcon(project.title, project.tags);
  const code = `P.${String(index + 1).padStart(2, '0')}`;
  return (
    <div className="fan-face">
      <div className="fan-typebar fan-typebar--accent" />
      <div className="fan-coderow">
        <span className="fan-code">
          {code}
          {project.year ? ` · ${project.year}` : ''}
        </span>
        <Icon className="fan-ico" size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="fan-title">{project.title}</p>
      <p className="fan-sub">{project.tags.slice(0, 2).join(' · ') || 'project'}</p>
      <div className="fan-chips">
        {project.tags.slice(0, 2).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
