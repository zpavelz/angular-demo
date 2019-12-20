import { NgModule               } from '@angular/core';
import { Routes, RouterModule   } from '@angular/router';

import { HomeComponent      } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthComponent      } from './components/auth/auth.component';

import { AuthGuardService   } from './services/authguard.service';

    const routes: Routes = [
        {
                path: '',
            component: HomeComponent,
            canActivate: [AuthGuardService]
    },
    {
        path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthGuardService]
    },
    {
        path: 'auth',
            component: AuthComponent,
            children: [
                {
                    path: 'sign',
                    component: AuthComponent
            }
        ]
    },
        {
            path: 'project/:id',
            component: DashboardComponent,
            canActivate: [AuthGuardService]
    }
];

   @NgModule({
         imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
})
export class AppRoutingModule { }
