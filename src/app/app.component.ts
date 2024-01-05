import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rick-and-morty';

  home=true

  constructor(private router: Router){}

  ngOnInit(): void {
    //subscribe to get anu modification of the url. Done to know when the user is on home page
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
        if (event.url === '/') {
          this.home=true
        }
        else{
          this.home=false
        }
      });
  }
}
