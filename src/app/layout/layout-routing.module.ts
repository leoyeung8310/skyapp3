import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'main', loadChildren: './main/main.module#MainModule' },
            { path: 'challenge-you', loadChildren: './challenge-you/challenge-you.module#ChallengeYouModule'},
          /*
           { path: 'statistic', loadChildren: './statistic/statistic.module#StatisticModule' },
           { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule' },
           { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule' },
           { path: 'inbox', loadChildren: './inbox/inbox.module#InboxModule' },
           { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
           { path: 'achievements', loadChildren: './achievements/achievements.module#AchievementsModule' },
           { path: 'records', loadChildren: './records/records.module#RecordsModule' },
           { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
           { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
           { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
           { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
           { path: 'forms', loadChildren: './form/form.module#FormModule' },
           { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
           { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
           { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
           { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
           */
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
