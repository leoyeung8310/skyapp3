import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common-service';

@Component({
    selector: 'app-sidebar',
    providers: [CommonService],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive = false;
    showMenu = 'language-pages'; // this value shows page by default, empty makes all collapse

    constructor(private translate: TranslateService, public cs: CommonService) {

    }

    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    changeLang(language: string) {
      this.translate.use(language);
    }
}
