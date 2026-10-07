import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export type AnalysisSeverity =
  'Critical' |
  'High' |
  'Medium' |
  'Low';


export interface AnalysisFinding {

  severity: AnalysisSeverity;

  category: string;

  title: string;

  description: string;

  suggestion: string;

  filePath: string;

  lineNumber: number;

}


export interface AnalysisResult {

  id: number;

  projectId: number;

  projectName: string;

  branch: string;

  commitSha: string;

  status: string;

  modelName: string;

  codeHealth: number;

  riskLevel: AnalysisSeverity;

  summary: string;

  findings: AnalysisFinding[];

}


export interface StartCommitAnalysisRequest {

  projectId: number;

  branch: string;

  commitSha: string;

}


/*
 * IMPACT ANALYSIS
 */
export interface ImpactRelatedFile {

  path: string;

  matchedTerms: string[];

  score: number;

}


export interface ImpactAnalysisResult
  extends AnalysisResult {

  extractedSymbols: string[];

  scannedFiles: number;

  relatedFiles: ImpactRelatedFile[];

}


@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private readonly apiUrl =
    'http://localhost:3000/api/analysis';


  constructor(
    private readonly http: HttpClient
  ) {
  }


  /*
   * ANALYZE COMMIT
   */
  analyzeCommit(
    request: StartCommitAnalysisRequest
  ): Observable<AnalysisResult> {

    return this.http
      .post<AnalysisResult>(
        `${this.apiUrl}/commit`,
        request
      );

  }


  /*
   * IMPACT / REGRESSION ANALYSIS
   */
  analyzeImpact(
    request: StartCommitAnalysisRequest
  ): Observable<ImpactAnalysisResult> {

    return this.http
      .post<ImpactAnalysisResult>(
        `${this.apiUrl}/impact`,
        request
      );

  }


  /*
   * GET ANALYSIS
   */
  getById(
    id: number
  ): Observable<AnalysisResult> {

    return this.http
      .get<AnalysisResult>(
        `${this.apiUrl}/${id}`
      );

  }

}