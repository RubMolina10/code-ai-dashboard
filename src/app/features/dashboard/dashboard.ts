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
  RouterLink
} from '@angular/router';

import {
  DashboardData,
  DashboardService
} from '../../core/services/dashboard';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    RouterLink,
    DatePipe
  ],

  templateUrl:
    './dashboard.html',

  styleUrl:
    './dashboard.scss'
})
export class Dashboard
  implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  data:
    DashboardData | null =
    null;


  loading =
    false;


  errorMessage =
    '';


  ngOnInit(): void {

    this.loadDashboard();

  }


  /*
   * LOAD DASHBOARD
   */
  loadDashboard(): void {

    this.loading =
      true;

    this.errorMessage =
      '';


    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (data) => {

          this.data =
            data;


          this.loading =
            false;


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Dashboard error:',
            error
          );


          this.loading =
            false;


          this.errorMessage =

            error?.error?.message ??

            'No fue posible cargar el dashboard.';


          this.cdr.detectChanges();

        }

      });

  }


  /*
   * SHORT SHA
   */
  shortSha(
    sha?: string
  ): string {

    if (!sha) {

      return '-';

    }


    return sha.substring(
      0,
      8
    );

  }


  /*
   * HEALTH TEXT
   */
  get healthText(): string {

    const health =
      this.data
        ?.metrics
        .codeHealth ??
      0;


    if (
      health >= 90
    ) {

      return 'Excelente estado del código';

    }


    if (
      health >= 80
    ) {

      return 'Buen estado general';

    }


    if (
      health >= 70
    ) {

      return 'Estado aceptable';

    }


    if (
      health >= 50
    ) {

      return 'Código con riesgos';

    }


    return 'Requiere atención';

  }

}