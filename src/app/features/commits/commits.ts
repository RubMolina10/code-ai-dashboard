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
  ProjectService
} from '../../core/services/project';

import {
  Project
} from '../../core/models/project.model';

import {
  GithubBranch,
  GithubCommit,
  GithubService
} from '../../core/services/github';


@Component({
  selector: 'app-commits',

  standalone: true,

  imports: [
    FormsModule,
    DatePipe
  ],

  templateUrl: './commits.html',

  styleUrl: './commits.scss'
})
export class Commits implements OnInit {

  private readonly projectService =
    inject(ProjectService);

  private readonly githubService =
    inject(GithubService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  projects: Project[] = [];

  branches: GithubBranch[] = [];

  commits: GithubCommit[] = [];


  selectedProjectId:
    number | null = null;

  selectedBranch = '';


  loadingProjects = false;

  loadingBranches = false;

  loadingCommits = false;


  errorMessage = '';


  ngOnInit(): void {

    this.loadProjects();

  }


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
           * Por ahora la pantalla Commits
           * trabaja solamente con proyectos GitHub.
           */
          this.projects =
            projects.filter(
              project =>
                project.provider ===
                'GitHub'
            );


          this.loadingProjects =
            false;


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

        },

        complete: () => {

          console.log(
            'Projects request completed'
          );

        }

      });

  }


  get selectedProject():
    Project | undefined {

    return this.projects.find(
      project =>
        project.id ===
        this.selectedProjectId
    );

  }


  onProjectChange(): void {

    this.branches =
      [];

    this.commits =
      [];

    this.selectedBranch =
      '';

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


    if (
      project.provider !==
      'GitHub'
    ) {

      this.errorMessage =
        'Por ahora la consulta de commits está disponible para GitHub.';

      return;

    }


    this.loadBranches(
      project
    );

  }


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

          console.log(
            'Branches received:',
            response.branches
          );


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
           * Primero intentamos seleccionar
           * la rama configurada en el proyecto.
           */
          const configuredBranch =
            this.branches.find(
              branch =>
                branch.name ===
                project.defaultBranch
            );


          /*
           * Si no existe:
           *
           * 1. main
           * 2. master
           * 3. primera rama
           */
          const mainBranch =
            this.branches.find(
              branch =>
                branch.name ===
                'main'
            );


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

            'No fue posible cargar las ramas del repositorio.';


          this.cdr.detectChanges();

        }

      });

  }


  onBranchChange(): void {

    this.commits =
      [];

    this.errorMessage =
      '';


    this.loadCommits();

  }


  loadCommits(): void {

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


    if (
      !this.selectedBranch
    ) {

      this.errorMessage =
        'Selecciona una rama.';

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

          console.log(
            'Commits received:',
            response.commits
          );


          this.commits =
            response.commits;


          this.loadingCommits =
            false;


          if (
            this.commits.length === 0
          ) {

            this.errorMessage =
              'No se encontraron commits en la rama seleccionada.';

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


  refresh(): void {

    if (
      this.loadingCommits
    ) {

      return;

    }


    this.loadCommits();

  }

}