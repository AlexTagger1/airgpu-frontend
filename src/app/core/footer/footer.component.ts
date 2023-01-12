import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // get dynamic footer content values
  public termsUrl = environment.general.termsUrl;
  public privacyPolicyUrl = environment.general.privacyPolicyUrl;
  public cookiePolicyUrl = environment.general.cookiePolicyUrl;

  public appName = environment.general.appName;
  public copyrightHolderName = environment.general.copyrightHolderName;

  public year = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }

}
