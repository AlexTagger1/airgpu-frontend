import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public collapsed = true;
  public appName = environment.general.appName;
  public user

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.getUser$().subscribe(user => this.user = user)
  }

  onClickOutside() {
    if (!this.collapsed) {
      this.collapsed = true
    }
  }


}
