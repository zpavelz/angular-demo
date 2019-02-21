import { BrowserModule      } from '@angular/platform-browser';
import { NgModule           } from '@angular/core';
import { FormsModule        } from '@angular/forms';
import { HttpClientModule   } from '@angular/common/http';

import { AppRoutingModule   } from './app-routing.module';
import { AppComponent       } from './app.component';

import { HomeComponent      } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthComponent      } from './components/auth/auth.component';
import { TimeFormComponent  } from './components/time-form/time-form.component';
import { TaskFormComponent  } from './components/task-form/task-form.component';

import { TasksPipe } from './tasks.pipe';

import { CarouselModule } from 'angular2-carousel';
import { DragulaModule  } from 'ng2-dragula';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TimeFormComponent,
        TaskFormComponent,
        DashboardComponent,
        AuthComponent,
        TasksPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        DragulaModule,
        CarouselModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
