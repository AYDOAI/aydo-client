import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {UIService} from "../../services/ui.service";
import {BackendService} from "../../services/backend.service";
import {Router} from "@angular/router";
import {ErrorsService} from "../../services/errors.service";
import {StorageService} from "../../services/storage.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

    ngOnInit(): void {

    }
}
