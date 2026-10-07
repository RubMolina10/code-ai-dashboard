export type FindingSeverity =
  'Critical' |
  'High' |
  'Medium' |
  'Low';


export type FindingStatus =
  'New' |
  'Resolved';


export interface Finding {

  id: number;

  analysisRunId: number;

  projectId: number;

  projectName: string;

  branchName: string;

  commitSha: string;

  modelName: string;

  codeHealth: number;

  riskLevel: string;

  severity: FindingSeverity;

  category: string;

  title: string;

  description: string;

  suggestion: string;

  filePath: string;

  lineNumber:
    number | null;

  status: FindingStatus;

  dateCreated: string;

  dateResolved:
    string | null;

}