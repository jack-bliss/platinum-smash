import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './polyfills';
import { AppModule } from './modules/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);