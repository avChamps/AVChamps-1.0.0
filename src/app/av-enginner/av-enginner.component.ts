import { Component, OnInit } from '@angular/core';
import { FaServiceService } from '../services/fa-service.service';

@Component({
  selector: 'app-av-enginner',
  templateUrl: './av-enginner.component.html',
  styleUrls: ['./av-enginner.component.css']
})
export class AvEnginnerComponent implements OnInit {
  constructor(private faService : FaServiceService) {}
  ngOnInit(): void {
  }

  }
