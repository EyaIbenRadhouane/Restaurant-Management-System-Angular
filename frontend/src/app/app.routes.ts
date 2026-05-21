import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

import { LoginComponent }            from './pages/login/login.component';
import { DashboardClientComponent }  from './pages/dashboard-client/dashboard-client.component';
import { AdminComponent }            from './pages/admin/admin.component';

import { ListePlatsComponent }       from './pages/liste-plats/liste-plats.component';
import { AjoutPlatComponent }        from './pages/ajout-plat/ajout-plat.component';
import { EditPlatComponent }         from './pages/edit-plat/edit-plat.component';
import { ListeCategoriesComponent }  from './pages/liste-categories/liste-categories.component';
import { ListeCommandesComponent }   from './pages/liste-commandes/liste-commandes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Dashboard client
  {
    path: 'dashboard',
    component: DashboardClientComponent,
    canActivate: [authGuard]
  },

  // Espace admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '',           redirectTo: 'plats', pathMatch: 'full' },
      { path: 'plats',      component: ListePlatsComponent },
      { path: 'plats/ajout', component: AjoutPlatComponent },
      { path: 'plats/edit/:id', component: EditPlatComponent },
      { path: 'categories', component: ListeCategoriesComponent },
      { path: 'commandes',  component: ListeCommandesComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];