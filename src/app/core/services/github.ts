import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface GithubBranch {

  name: string;

  sha: string;

  protected: boolean;

}


export interface GithubBranchesResponse {

  repositoryUrl: string;

  branches: GithubBranch[];

}


export interface GithubCommit {

  sha: string;

  shortSha: string;

  message: string;

  authorName: string;

  authorEmail: string;

  authorLogin?: string;

  date: string;

  url: string;

}


export interface GithubCommitsResponse {

  repositoryUrl: string;

  branch: string;

  total: number;

  commits: GithubCommit[];

}


export interface GithubCommitFile {

  filename: string;

  status: string;

  additions: number;

  deletions: number;

  changes: number;

  patch?: string;

  rawUrl?: string;

  blobUrl?: string;

}


export interface GithubCommitDetail {

  sha: string;

  shortSha: string;

  message: string;

  authorName: string;

  authorEmail: string;

  date: string;

  url: string;

  stats: {

    total: number;

    additions: number;

    deletions: number;

  };

  files: GithubCommitFile[];

}


@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly apiUrl =
    'http://localhost:3000/api/github';


  constructor(
    private readonly http: HttpClient
  ) {
  }


  getBranches(
    repositoryUrl: string
  ): Observable<GithubBranchesResponse> {

    return this.http
      .get<GithubBranchesResponse>(
        `${this.apiUrl}/branches`,
        {
          params: {
            repositoryUrl
          }
        }
      );

  }


  getCommits(
    repositoryUrl: string,
    branch: string
  ): Observable<GithubCommitsResponse> {

    return this.http
      .get<GithubCommitsResponse>(
        `${this.apiUrl}/commits`,
        {
          params: {

            repositoryUrl,

            branch

          }
        }
      );

  }


  getCommitDetail(
    repositoryUrl: string,
    sha: string
  ): Observable<GithubCommitDetail> {

    return this.http
      .get<GithubCommitDetail>(
        `${this.apiUrl}/commit-diff`,
        {
          params: {

            repositoryUrl,

            sha

          }
        }
      );

  }

}