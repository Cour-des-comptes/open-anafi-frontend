import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatTableModule

} from '@angular/material';
import { LOCALE_ID } from '@angular/core';
import { MatTableExporterModule } from 'mat-table-exporter';

import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';

import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserConnectedComponent } from './components/user-connected/user-connected.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { MenuComponent } from './components/menu/menu.component';
import { ProductionComponent } from './components/production/production.component';
import { DialogFrameComponent } from './components/creation/dialog-frame/dialog-frame.component';
import { DialogFrameAddIndicatorComponent } from './components/creation/dialog-frame-add-indicator/dialog-frame-add-indicator.component';
import { CreationComponent } from './components/creation/creation.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { CommentComponent } from './components/comment/comment.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { Ng5SliderModule } from 'ng5-slider';
import { MatomoModule } from 'ngx-matomo';

import { ExportAsModule } from 'ngx-export-as';


import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// VIDEO PLAYER
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogNomenclatureComponent } from './components/creation/dialog-nomenclature/dialog-nomenclature.component';
import { IndicatorCreationComponent } from './components/indicator-creation/indicator-creation.component';
import { FilterIndicatorsPipe } from './pipes/filterIndicators.pipe';
import {CustomAlertService} from './services/alerts/custom-alert.service';
import {ToastrModule} from 'ngx-toastr';






// import {DragDropModule} from '@angular/cdk/drag-drop';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  minScrollbarLength: 40
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserConnectedComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    ProductionComponent,
    CreationComponent,
    DocumentationComponent,
    CommentComponent,
    DialogFrameComponent,
    DialogFrameAddIndicatorComponent,
    FilterPipe,
    SortPipe,
    FilterIndicatorsPipe,
    DialogNomenclatureComponent,
    IndicatorCreationComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatListModule,
    PerfectScrollbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatExpansionModule,
    Ng5SliderModule,
    VgCoreModule,
    VgControlsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    DragDropModule,
    MatButtonToggleModule,
    MatomoModule,
    ExportAsModule,
    MatTableExporterModule,
    ToastrModule.forRoot()
  ],
  providers: [
    CookieService,
    CustomAlertService,
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  entryComponents: [DialogNomenclatureComponent, DialogFrameAddIndicatorComponent, DialogFrameComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
