import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Project
} from '../../core/models/project.model';

import {
  Finding
} from '../../core/models/finding.model';

import {
  ProjectService
} from '../../core/services/project';

import {
  FindingService
} from '../../core/services/finding';


@Component({
  selector: 'app-findings',

  standalone: true,

  imports: [
    FormsModule,
    DatePipe
  ],

  templateUrl:
    './findings.html',

  styleUrl:
    './findings.scss'
})
export class Findings
  implements OnInit {

  private readonly findingService =
    inject(FindingService);

  private readonly projectService =
    inject(ProjectService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  findings:
    Finding[] = [];


  projects:
    Project[] = [];


  loading =
    false;


  errorMessage =
    '';


  selectedProjectId:
    number | null =
    null;


  selectedSeverity =
    '';


  selectedStatus =
    '';


  selectedFinding:
    Finding | null =
    null;


  showDetailModal =
    false;


  ngOnInit(): void {

    this.loadProjects();

    this.loadFindings();

  }


  /*
   * PROJECTS
   */
  loadProjects(): void {

    this.projectService
      .getAll()
      .subscribe({

        next: (projects) => {

          this.projects =
            projects;


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading projects:',
            error
          );

        }

      });

  }


  /*
   * FINDINGS
   */
  loadFindings(): void {

    this.loading =
      true;


    this.errorMessage =
      '';


    this.findingService
      .getAll({

        projectId:
          this.selectedProjectId ??
          undefined,

        severity:
          this.selectedSeverity ||
          undefined,

        status:
          this.selectedStatus ||
          undefined

      })
      .subscribe({

        next: (findings) => {

          this.findings =
            findings;


          this.loading =
            false;


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading findings:',
            error
          );


          this.loading =
            false;


          this.errorMessage =

            error?.error?.message ??

            'No fue posible cargar los findings.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * FILTER CHANGE
   */
  onFilterChange(): void {

    this.loadFindings();

  }


  /*
   * CLEAR FILTERS
   */
  clearFilters(): void {

    this.selectedProjectId =
      null;

    this.selectedSeverity =
      '';

    this.selectedStatus =
      '';


    this.loadFindings();

  }


  /*
   * DETAIL
   */
  openFinding(
    finding: Finding
  ): void {

    this.selectedFinding =
      finding;

    this.showDetailModal =
      true;

  }


  closeFinding(): void {

    this.selectedFinding =
      null;

    this.showDetailModal =
      false;

  }


  /*
   * RESOLVE
   */
  resolveFinding(
    finding: Finding,
    event?: Event
  ): void {

    event
      ?.stopPropagation();


    if (
      finding.status ===
      'Resolved'
    ) {

      return;

    }


    this.findingService
      .updateStatus(
        finding.id,
        'Resolved'
      )
      .subscribe({

        next: () => {

          finding.status =
            'Resolved';


          finding.dateResolved =
            new Date()
              .toISOString();


          if (
            this.selectedFinding
              ?.id ===
            finding.id
          ) {

            this.selectedFinding =
              finding;

          }


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error resolving finding:',
            error
          );


          this.errorMessage =

            error?.error?.message ??

            'No fue posible resolver el finding.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * REOPEN
   */
  reopenFinding(
    finding: Finding,
    event?: Event
  ): void {

    event
      ?.stopPropagation();


    this.findingService
      .updateStatus(
        finding.id,
        'New'
      )
      .subscribe({

        next: () => {

          finding.status =
            'New';


          finding.dateResolved =
            null;


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            error
          );

        }

      });

  }


  /*
   * COUNTERS
   */
  get totalCount(): number {

    return this.findings.length;

  }


  get criticalCount(): number {

    return this.findings
      .filter(
        finding =>
          finding.severity ===
          'Critical'
      )
      .length;

  }


  get highCount(): number {

    return this.findings
      .filter(
        finding =>
          finding.severity ===
          'High'
      )
      .length;

  }


  get openCount(): number {

    return this.findings
      .filter(
        finding =>
          finding.status ===
          'New'
      )
      .length;

  }


  /*
   * SHORT SHA
   */
  shortSha(
    sha: string
  ): string {

    if (!sha) {

      return '-';

    }


    return sha.substring(
      0,
      8
    );

  }

}