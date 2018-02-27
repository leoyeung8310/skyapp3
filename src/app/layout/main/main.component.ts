import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common-service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  providers: [CommonService],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public alerts: Array<any> = [];
  public sliders: Array<any> = [];
  constructor(
    public cs: CommonService,
    private router: Router
  ) {
    this.sliders.push({
      imagePath: 'assets/images/slider1.jpg',
      label: 'First slide label',
      text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    }, {
      imagePath: 'assets/images/slider2.jpg',
      label: 'Second slide label',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }, {
      imagePath: 'assets/images/slider3.jpg',
      label: 'Third slide label',
      text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    });

    this.alerts.push({
      id: 1,
      type: 'success',
      message: `This is new user tip 1 : Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis.`,
    }, {
      id: 2,
      type: 'warning',
      message: `This is new user tip 2 : Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis.`,
    });
  }

  ngOnInit() {
    this.router.navigateByUrl('/challenge-you').then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    });
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
