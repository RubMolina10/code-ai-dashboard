import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  DatePipe
} from '@angular/common';

import {
  Observable
} from 'rxjs';

import {
  Project
} from '../../core/models/project.model';

import {
  ProjectService
} from '../../core/services/project';

import {
  GithubBranch,
  GithubCommit,
  GithubService
} from '../../core/services/github';

import {
  AnalysisResult,
  AnalysisService
} from '../../core/services/analysis';


@Component({
  selector: 'app-analysis',

  standalone: true,

  imports: [
    FormsModule,
    DatePipe
  ],

  templateUrl:
    './analysis.html',

  styleUrl:
    './analysis.scss'
})
export class Analysis implements OnInit {

  private readonly projectService =
    inject(ProjectService);


  private readonly githubService =
    inject(GithubService);


  private readonly analysisService =
    inject(AnalysisService);


  private readonly cdr =
    inject(ChangeDetectorRef);


  /*
   * PROJECTS
   */
  projects: Project[] = [];


  /*
   * BRANCHES
   */
  branches: GithubBranch[] = [];


  /*
   * COMMITS
   */
  commits: GithubCommit[] = [];


  /*
   * ANALYSIS TYPE
   */
  analysisType:
    'commit' |
    'impact' =
    'commit';


  /*
   * SELECTED VALUES
   */
  selectedProjectId:
    number | null =
    null;


  selectedBranch =
    '';


  selectedCommitSha =
    '';


  /*
   * LOADING
   */
  loadingProjects =
    false;


  loadingBranches =
    false;


  loadingCommits =
    false;


  analysisRunning =
    false;


  /*
   * ERROR
   */
  errorMessage =
    '';


  /*
   * RESULT
   */
  analysisResult:
    AnalysisResult | null =
    null;


  ngOnInit(): void {

    this.loadProjects();

  }


  /*
   * SELECTED PROJECT
   */
  get selectedProject():
    Project | undefined {

    return this.projects.find(
      project =>
        project.id ===
        this.selectedProjectId
    );

  }


  /*
   * SELECTED COMMIT
   */
  get selectedCommit():
    GithubCommit | undefined {

    return this.commits.find(
      commit =>
        commit.sha ===
        this.selectedCommitSha
    );

  }


  /*
   * LOAD PROJECTS
   */
  loadProjects(): void {

    this.loadingProjects =
      true;


    this.errorMessage =
      '';


    this.projectService
      .getAll()
      .subscribe({

        next: (projects) => {

          /*
           * Por ahora Analysis solamente
           * trabaja con GitHub.
           */
          this.projects =
            projects.filter(
              project =>
                project.provider
                  ?.trim()
                  .toLowerCase() ===
                'github'
            );


          this.loadingProjects =
            false;


          /*
           * Seleccionar primer proyecto.
           */
          if (
            this.projects.length > 0
          ) {

            this.selectedProjectId =
              this.projects[0].id;


            this.onProjectChange();

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error loading projects:',
            error
          );


          this.loadingProjects =
            false;


          this.errorMessage =
            'No fue posible cargar los proyectos.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * PROJECT CHANGE
   */
  onProjectChange(): void {

    this.branches =
      [];


    this.commits =
      [];


    this.selectedBranch =
      '';


    this.selectedCommitSha =
      '';


    this.analysisResult =
      null;


    this.errorMessage =
      '';


    const project =
      this.selectedProject;


    if (!project) {

      return;

    }


    if (
      !project.repositoryUrl
    ) {

      this.errorMessage =
        'El proyecto no tiene una URL de repositorio configurada.';


      return;

    }


    this.loadBranches(
      project
    );

  }


  /*
   * LOAD BRANCHES
   */
  loadBranches(
    project: Project
  ): void {

    if (
      !project.repositoryUrl
    ) {

      return;

    }


    this.loadingBranches =
      true;


    this.errorMessage =
      '';


    this.githubService
      .getBranches(
        project.repositoryUrl
      )
      .subscribe({

        next: (response) => {

          this.branches =
            response.branches;


          this.loadingBranches =
            false;


          if (
            this.branches.length === 0
          ) {

            this.errorMessage =
              'El repositorio no tiene ramas disponibles.';


            this.cdr.detectChanges();


            return;

          }


          /*
           * Buscar la rama configurada
           * en el proyecto.
           */
          const configuredBranch =
            this.branches.find(
              branch =>
                branch.name ===
                project.defaultBranch
            );


          /*
           * Fallback main.
           */
          const mainBranch =
            this.branches.find(
              branch =>
                branch.name ===
                'main'
            );


          /*
           * Fallback master.
           */
          const masterBranch =
            this.branches.find(
              branch =>
                branch.name ===
                'master'
            );


          this.selectedBranch =

            configuredBranch?.name ??

            mainBranch?.name ??

            masterBranch?.name ??

            this.branches[0].name;


          /*
           * Ya con rama seleccionada
           * obtenemos commits.
           */
          this.loadCommits();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error loading branches:',
            error
          );


          this.loadingBranches =
            false;


          this.errorMessage =

            error?.error?.message ??

            'No fue posible cargar las ramas.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * BRANCH CHANGE
   */
  onBranchChange(): void {

    this.commits =
      [];


    this.selectedCommitSha =
      '';


    this.analysisResult =
      null;


    this.errorMessage =
      '';


    this.loadCommits();

  }


  /*
   * LOAD COMMITS
   */
  loadCommits(): void {

    const project =
      this.selectedProject;


    if (
      !project ||
      !project.repositoryUrl
    ) {

      return;

    }


    if (
      !this.selectedBranch
    ) {

      return;

    }


    this.loadingCommits =
      true;


    this.errorMessage =
      '';


    this.githubService
      .getCommits(
        project.repositoryUrl,
        this.selectedBranch
      )
      .subscribe({

        next: (response) => {

          this.commits =
            response.commits;


          this.loadingCommits =
            false;


          /*
           * GitHub devuelve primero
           * el commit más reciente.
           */
          if (
            this.commits.length > 0
          ) {

            this.selectedCommitSha =
              this.commits[0].sha;

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error loading commits:',
            error
          );


          this.loadingCommits =
            false;


          this.commits =
            [];


          this.errorMessage =

            error?.error?.message ??

            'No fue posible cargar los commits.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * COMMIT CHANGE
   */
  onCommitChange(): void {

    this.analysisResult =
      null;


    this.errorMessage =
      '';

  }


  /*
   * START ANALYSIS
   */
  startAnalysis(): void {

    if (
      !this.selectedProjectId
    ) {

      this.errorMessage =
        'Selecciona un proyecto.';


      return;

    }


    if (
      !this.selectedBranch
    ) {

      this.errorMessage =
        'Selecciona una rama.';


      return;

    }


    if (
      !this.selectedCommitSha
    ) {

      this.errorMessage =
        'Selecciona un commit.';


      return;

    }


    this.analysisRunning =
      true;


    this.analysisResult =
      null;


    this.errorMessage =
      '';


    /*
     * REQUEST
     */
    const request = {

      projectId:
        this.selectedProjectId,

      branch:
        this.selectedBranch,

      commitSha:
        this.selectedCommitSha

    };


    /*
     * ANALYSIS TYPE
     *
     * commit:
     * Analiza solamente el cambio
     * realizado en el commit.
     *
     * impact:
     * Busca posibles regresiones
     * en otras partes del proyecto.
     */
    const analysisRequest:
      Observable<AnalysisResult> =

      this.analysisType ===
      'impact'

        ? this.analysisService
            .analyzeImpact(
              request
            )

        : this.analysisService
            .analyzeCommit(
              request
            );


    /*
     * EXECUTE ANALYSIS
     */
    analysisRequest
      .subscribe({

        next: (result) => {

          console.log(
            'Analysis result:',
            result
          );


          this.analysisResult =
            result;


          this.analysisRunning =
            false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Analysis error:',
            error
          );


          this.analysisRunning =
            false;


          this.errorMessage =

            error?.error?.message ??

            'No fue posible ejecutar el análisis.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * REFRESH
   */
  refreshCommits(): void {

    if (
      this.loadingCommits ||
      this.analysisRunning
    ) {

      return;

    }


    this.loadCommits();

  }


  /*
   * COMMIT LABEL
   */
  getCommitLabel(
    commit: GithubCommit
  ): string {

    return `${commit.shortSha} - ${commit.message}`;

  }


  /*
   * FINDING COUNT
   */
  get criticalCount(): number {

    return this.analysisResult
      ?.findings
      .filter(
        finding =>
          finding.severity ===
          'Critical'
      )
      .length ??
      0;

  }


  get highCount(): number {

    return this.analysisResult
      ?.findings
      .filter(
        finding =>
          finding.severity ===
          'High'
      )
      .length ??
      0;

  }


  get mediumCount(): number {

    return this.analysisResult
      ?.findings
      .filter(
        finding =>
          finding.severity ===
          'Medium'
      )
      .length ??
      0;

  }


  get lowCount(): number {

    return this.analysisResult
      ?.findings
      .filter(
        finding =>
          finding.severity ===
          'Low'
      )
      .length ??
      0;

  }

}