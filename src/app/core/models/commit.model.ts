export interface Commit {
  sha: string;
  shortSha: string;

  author: string;

  message: string;

  branch: string;

  date: Date;

  filesChanged: number;

  linesAdded: number;

  linesRemoved: number;
}