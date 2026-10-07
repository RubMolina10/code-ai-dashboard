export interface Project {

  id: number;

  name: string;

  description?: string;

  projectType: string;

  provider: string;

  repositoryUrl?: string | null;

  localPath?: string | null;

  defaultBranch?: string | null;

  active: boolean;

  technologies: string[];

  dateCreated?: Date;

}