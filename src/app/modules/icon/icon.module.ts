import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Server, AlertCircle, User, Star, ArrowDown, ArrowUp, MoreHorizontal, RefreshCw, ArrowRight, ExternalLink } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Server,
  AlertCircle,
  User,
  Star,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  RefreshCw,
  ArrowRight,
  ExternalLink
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconModule { }
