import { Finding } from './finding.model';

export interface Analysis {

  id: number;

  projectId: number;

  branch: string;

  commitSha?: string;

  status:
    | 'Pending'
    | 'Running'
    | 'Completed'
    | 'Failed';

  buildSuccess: boolean;

  testsSuccess: boolean;

  codeHealth: number;

  findings: Finding[];

  createdAt: Date;

}