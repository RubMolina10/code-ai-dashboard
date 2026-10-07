import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Project
} from '../models/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly apiUrl =
    'http://localhost:3000/api/projects';


  constructor(
    private http: HttpClient
  ) {
  }


  getAll(): Observable<Project[]> {

    return this.http.get<Project[]>(
      this.apiUrl
    );

  }


  getById(
    id: number
  ): Observable<Project> {

    return this.http.get<Project>(
      `${this.apiUrl}/${id}`
    );

  }
  create(
  project: {
    name: string;
    description?: string;
    projectType: string;
    provider: string;
    repositoryUrl?: string;
    localPath?: string;
    defaultBranch?: string;
    technologies?: string[];
  }
): Observable<Project> {

  return this.http.post<Project>(
    this.apiUrl,
    project
  );

}
delete(
  id: number
): Observable<void> {

  return this.http.delete<void>(
    `${this.apiUrl}/${id}`
  );

}

}