import { Routes } from '@angular/router';

import { Shell } from './layout/shell/shell';

import { Dashboard } from './features/dashboard/dashboard';
import { Projects } from './features/projects/projects';
import { Analysis } from './features/analysis/analysis';
import { Commits } from './features/commits/commits';
import { Findings } from './features/findings/findings';

export const routes: Routes = [
  {
    path: '',
    component: Shell,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'projects',
        component: Projects
      },

      {
        path: 'analysis',
        component: Analysis
      },

      {
        path: 'commits',
        component: Commits
      },

      {
        path: 'findings',
        component: Findings
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];