import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface DashboardMetrics {

  codeHealth: number;

  projects: number;

  findings: number;

  commits: number;

}


export interface DashboardFindingsSummary {

  critical: number;

  high: number;

  medium: number;

  low: number;

  resolved: number;

}


export interface DashboardAnalysis {

  id: number;

  projectId: number;

  projectName: string;

  provider?: string;

  repositoryUrl?: string;

  defaultBranch?: string;

  branchName: string;

  commitSha: string;

  status: string;

  codeHealth: number;

  riskLevel: string;

  modelName: string;

  summary?: string;

  startedAt?: string;

  completedAt?: string;

  filesChanged?: number;

  linesAdded?: number;

  linesRemoved?: number;

  technologies?: string[];

  findingCount?: number;

}


export interface DashboardData {

  metrics: DashboardMetrics;

  findingsSummary:
    DashboardFindingsSummary;

  lastAnalysis:
    DashboardAnalysis | null;

  recentAnalyses:
    DashboardAnalysis[];

}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    'http://localhost:3000/api/dashboard';


  constructor(
    private readonly http:
      HttpClient
  ) {
  }


  getDashboard():
    Observable<DashboardData> {

    return this.http
      .get<DashboardData>(
        this.apiUrl
      );

  }

}