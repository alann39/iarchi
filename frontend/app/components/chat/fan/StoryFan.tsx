'use client';

import {ExperienceCard} from '../cards/ExperienceCard';
import {ProjectCard} from '../cards/ProjectCard';
import {TasteCard} from '../cards/TasteCard';
import type {ToolEvent} from '../types';
import {FanStack} from './FanStack';
import {MovieCard} from './MovieCard';
import {ExperienceFace} from './faces/ExperienceFace';
import {MovieFace} from './faces/MovieFace';
import {MusicFace} from './faces/MusicFace';
import {ProjectFace} from './faces/ProjectFace';

export interface StoryFanProps {
  /** Tool event with presentation:'compact' (story mode only). */
  tool: ToolEvent;
}

/**
 * Routes a compact tool event to its fan stack(s) (TASK-17).
 * show_taste splits into MUSIC and MOVIES stacks by pick.category.
 * Full cards in the modal reuse the existing card components, except
 * movies which get a portrait-poster row (MovieCard).
 */
export function StoryFan({tool}: StoryFanProps) {
  switch (tool.name) {
    case 'show_projects': {
      const projects = tool.result.projects ?? [];
      if (projects.length === 0) return null;
      return (
        <FanStack
          label="Projects"
          items={projects}
          renderFace={(project, i) => <ProjectFace project={project} index={i} />}
          renderFull={(project, i) => <ProjectCard project={project} index={i} />}
        />
      );
    }
    case 'show_experience': {
      const experience = tool.result.experience ?? [];
      if (experience.length === 0) return null;
      return (
        <FanStack
          label="Experience"
          items={experience}
          renderFace={(item, i) => <ExperienceFace experience={item} index={i} />}
          renderFull={(item) => <ExperienceCard experience={item} />}
        />
      );
    }
    case 'show_taste': {
      const picks = tool.result.picks ?? [];
      const music = picks.filter((p) => p.category === 'music');
      const movies = picks.filter((p) => p.category !== 'music');
      if (music.length === 0 && movies.length === 0) return null;
      return (
        <>
          {music.length > 0 && (
            <FanStack
              label="Music"
              items={music}
              renderFace={(pick, i) => <MusicFace pick={pick} index={i} />}
              renderFull={(pick) => <TasteCard pick={pick} />}
            />
          )}
          {movies.length > 0 && (
            <FanStack
              label="Movies"
              items={movies}
              renderFace={(pick, i) => <MovieFace pick={pick} index={i} />}
              renderFull={(pick) => <MovieCard pick={pick} />}
            />
          )}
        </>
      );
    }
    default:
      return null;
  }
}
