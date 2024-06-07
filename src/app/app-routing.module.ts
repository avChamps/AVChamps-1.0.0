import { Component, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomePageComponent } from './home-page/home-page.component'
import { LoginPageComponent } from './login-page/login-page.component'
import { AvEnginnerComponent } from './av-enginner/av-enginner.component'
import { AdminPageComponent } from './admin-page/admin-page.component'
import { EkartComponent } from './ekart/ekart.component'
import { BussinessCardComponent } from './bussiness-card/bussiness-card.component'
import { CommunityPageComponent } from './community-page/community-page.component'
import { ContactComponent } from './home-page/contact/contact.component'
import { AuthGuardService } from './services/auth-guard.service'
import { GuidlinesComponent } from './home-page/guidlines/guidlines.component'
import { RedirectPageComponent } from './redirect-page/redirect-page.component'

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: '****', redirectTo: '' },
  { path: 'home-page', redirectTo: '' },
  { path: 'contactUs', component: ContactComponent },
  { path: 'privacy-policy', component: GuidlinesComponent },
  { path: 'cookie-policy', component: GuidlinesComponent },
  { path: 'accept-policy', component: GuidlinesComponent }, 
  { path: 'platform-policy', component: GuidlinesComponent },
  { path: 'login-page/:value', component: LoginPageComponent },
  { path: 'redirected-page/:value', component: RedirectPageComponent },
  { path: 'ekart-page', component: EkartComponent,canActivate: [AuthGuardService] },
  { path: 'av-community', component: CommunityPageComponent,canActivate: [AuthGuardService] },
  // { path: 'avEngineer-dashboard', component: AvEnginnerComponent, canActivate: [AuthGuardService] },
  { path: 'avEngineer-dashboard', component: AvEnginnerComponent, canActivate: [AuthGuardService]},
  { path: 'admin-page', component: AdminPageComponent },
  { path: 'bussiness-card/:emailId', component: BussinessCardComponent }
]   

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
