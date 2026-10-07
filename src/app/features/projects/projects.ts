import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ProjectService
} from '../../core/services/project';

import {
  Project
} from '../../core/models/project.model';

import {
  GithubService,
  GithubBranch
} from '../../core/services/github';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit {

  private readonly projectService =
    inject(ProjectService);

  private readonly githubService =
    inject(GithubService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  projects: Project[] = [];

  selectedProject?: Project;

  loading = false;

  errorMessage = '';


  // CREATE PROJECT MODAL

  showCreateModal = false;


  newProject = {

    name: '',

    description: '',

    projectType: 'Personal',

    provider: 'Local',

    repositoryUrl: '',

    localPath: '',

    defaultBranch: 'main',

    technologiesText: ''

  };


  // GITHUB

  githubBranches: GithubBranch[] = [];

  loadingBranches = false;

  branchError = '';


  ngOnInit(): void {

    this.loadProjects();

  }


  loadProjects(): void {

    this.loading = true;

    this.errorMessage = '';


    this.projectService
      .getAll()
      .subscribe({

        next: (projects) => {

          console.log(
            'Projects received:',
            projects
          );

          this.projects =
            projects;

          this.loading =
            false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading projects:',
            error
          );

          this.errorMessage =
            'No fue posible cargar los proyectos.';

          this.loading =
            false;

          this.cdr.detectChanges();

        },

        complete: () => {

          console.log(
            'Projects request completed'
          );

        }

      });

  }


  selectProject(
    project: Project
  ): void {

    this.selectedProject =
      project;

  }


  openCreateModal(): void {

    this.resetProjectForm();

    this.showCreateModal =
      true;

  }


  closeCreateModal(): void {

    this.showCreateModal =
      false;

  }


  /*
   * Se ejecuta cuando cambia:
   *
   * Local
   * GitHub
   * Gitea
   */
  onProviderChange(): void {

    this.githubBranches = [];

    this.branchError = '';

    this.loadingBranches = false;


    if (
      this.newProject.provider ===
      'Local'
    ) {

      this.newProject.repositoryUrl =
        '';

      this.newProject.defaultBranch =
        'main';

    }
    else {

      this.newProject.localPath =
        '';

      this.newProject.defaultBranch =
        '';

    }

  }


  /*
   * Busca las ramas reales del
   * repositorio seleccionado en GitHub.
   */
  loadGithubBranches(): void {

    if (
      this.newProject.provider !==
      'GitHub'
    ) {

      return;

    }


    const repositoryUrl =
      this.newProject
        .repositoryUrl
        .trim();


    if (!repositoryUrl) {

      this.branchError =
        'Ingresa primero la URL del repositorio.';

      return;

    }


    this.loadingBranches =
      true;

    this.branchError =
      '';

    this.githubBranches =
      [];


    this.githubService
      .getBranches(
        repositoryUrl
      )
      .subscribe({

        next: (response) => {

          console.log(
            'GitHub branches:',
            response.branches
          );


          this.githubBranches =
            response.branches;

          this.loadingBranches =
            false;


          if (
            this.githubBranches.length ===
            0
          ) {

            this.branchError =
              'No se encontraron ramas en el repositorio.';

            this.cdr.detectChanges();

            return;

          }


          /*
           * Intentamos seleccionar:
           *
           * 1. main
           * 2. master
           * 3. primera rama encontrada
           */

          const mainBranch =
            this.githubBranches.find(
              branch =>
                branch.name ===
                'main'
            );


          const masterBranch =
            this.githubBranches.find(
              branch =>
                branch.name ===
                'master'
            );


          this.newProject.defaultBranch =

            mainBranch?.name ??

            masterBranch?.name ??

            this.githubBranches[0].name;


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading GitHub branches:',
            error
          );


          this.loadingBranches =
            false;

          this.githubBranches =
            [];


          this.branchError =

            error?.error?.message ??

            'No fue posible consultar las ramas de GitHub.';


          this.cdr.detectChanges();

        }

      });

  }


  saveProject(): void {

    if (
      !this.newProject.name.trim()
    ) {

      return;

    }


    /*
     * Si es GitHub, requerimos:
     *
     * Repository URL
     * Default branch
     */

    if (
      this.newProject.provider ===
      'GitHub'
    ) {

      if (
        !this.newProject
          .repositoryUrl
          .trim()
      ) {

        this.branchError =
          'Debes ingresar la URL del repositorio.';

        return;

      }


      if (
        !this.newProject
          .defaultBranch
          .trim()
      ) {

        this.branchError =
          'Debes seleccionar una rama.';

        return;

      }

    }


    const technologies =
      this.newProject
        .technologiesText
        .split(',')
        .map(
          technology =>
            technology.trim()
        )
        .filter(
          technology =>
            technology.length > 0
        );


    this.projectService
      .create({

        name:
          this.newProject.name,

        description:
          this.newProject.description,

        projectType:
          this.newProject.projectType,

        provider:
          this.newProject.provider,

        repositoryUrl:
          this.newProject.repositoryUrl,

        localPath:
          this.newProject.localPath,

        defaultBranch:
          this.newProject.defaultBranch,

        technologies

      })
      .subscribe({

        next: (project) => {

          console.log(
            'Project created:',
            project
          );


          this.closeCreateModal();

          this.resetProjectForm();

          this.loadProjects();

        },

        error: (error) => {

          console.error(
            'Error creating project:',
            error
          );

        }

      });

  }


  resetProjectForm(): void {

    this.newProject = {

      name: '',

      description: '',

      projectType: 'Personal',

      provider: 'Local',

      repositoryUrl: '',

      localPath: '',

      defaultBranch: 'main',

      technologiesText: ''

    };


    this.githubBranches =
      [];

    this.loadingBranches =
      false;

    this.branchError =
      '';

  }


  deleteProject(
    project: Project,
    event: MouseEvent
  ): void {

    event.stopPropagation();


    const confirmed =
      window.confirm(
        `¿Deseas eliminar el proyecto "${project.name}"?`
      );


    if (!confirmed) {

      return;

    }


    this.projectService
      .delete(
        project.id
      )
      .subscribe({

        next: () => {

          console.log(
            'Project deleted:',
            project.id
          );


          if (
            this.selectedProject?.id ===
            project.id
          ) {

            this.selectedProject =
              undefined;

          }


          this.loadProjects();

        },

        error: (error) => {

          console.error(
            'Error deleting project:',
            error
          );

        }

      });

  }


  get corporateCount(): number {

    return this.projects.filter(
      project =>
        project.projectType ===
        'Corporate'
    ).length;

  }


  get personalCount(): number {

    return this.projects.filter(
      project =>
        project.projectType ===
        'Personal'
    ).length;

  }


  get activeCount(): number {

    return this.projects.filter(
      project =>
        project.active
    ).length;

  }

}