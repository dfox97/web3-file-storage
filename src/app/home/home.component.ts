import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocUploadFormComponent } from 'src/app/home/doc-upload-form/doc-upload-form.component';
import { LogOutComponent } from 'src/app/home/log-out/log-out.component';
import { ViewerComponent } from 'src/app/home/viewer/viewer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, LogOutComponent, DocUploadFormComponent, ViewerComponent]
})
export class HomeComponent {
}
