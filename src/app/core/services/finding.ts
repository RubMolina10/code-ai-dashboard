import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Finding
} from '../models/finding.model';


export interface FindingFilters {

  projectId?:
    number;

  severity?:
    string;

  status?:
    string;

}


@Injectable({
  providedIn: 'root'
})
export class FindingService {

  private readonly apiUrl =
    'http://localhost:3000/api/findings';


  constructor(
    private readonly http:
      HttpClient
  ) {
  }


  /*
   * GET FINDINGS
   */
  getAll(
    filters:
      FindingFilters = {}
  ): Observable<Finding[]> {

    let params =
      new HttpParams();


    if (
      filters.projectId
    ) {

      params =
        params.set(
          'projectId',
          filters.projectId
        );

    }


    if (
      filters.severity
    ) {

      params =
        params.set(
          'severity',
          filters.severity
        );

    }


    if (
      filters.status
    ) {

      params =
        params.set(
          'status',
          filters.status
        );

    }


    return this.http
      .get<Finding[]>(
        this.apiUrl,
        {
          params
        }
      );

  }


  /*
   * GET BY ID
   */
  getById(
    id: number
  ): Observable<Finding> {

    return this.http
      .get<Finding>(
        `${this.apiUrl}/${id}`
      );

  }


  /*
   * UPDATE STATUS
   */
  updateStatus(
    id: number,
    status:
      'New' |
      'Resolved'
  ): Observable<{
    success: boolean;
  }> {

    return this.http
      .patch<{
        success: boolean;
      }>(
        `${this.apiUrl}/${id}/status`,
        {
          status
        }
      );

  }

}