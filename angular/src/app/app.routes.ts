import { Routes} from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ProductionComponent } from './components/production/production.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { LoginComponent } from './components/login/login.component';
import { CommentComponent } from './components/comment/comment.component';
import { CreationComponent } from './components/creation/creation.component';


export const APP_ROUTES: Routes = [
// { path:  '', canActivate: [AuthGuard], component:  HomeComponent},
  { path:  '',
  component:  HomeComponent,
  canActivate: [ AuthGuard ]
  },
  { path:  'login',
  component:  LoginComponent
  },
  { path:  'home',
  component:  HomeComponent,
  canActivate: [ AuthGuard ]
  },
  { path:  'comment/:type',
  component:  CommentComponent,
  canActivate: [ AuthGuard ]
  },
  { path:  'production',
  component:  ProductionComponent,
  canActivate: [ AuthGuard ]
  },
  { path:  'creation',
  component:  CreationComponent,
  canActivate: [ AuthGuard ]
  },
  { path:  'documentation',
  component:  DocumentationComponent,
  canActivate: [ AuthGuard ]
  },
  { path: '**',
  redirectTo: ''
  }
];


