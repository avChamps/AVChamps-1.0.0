import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FaServiceService } from 'src/app/services/fa-service.service';
import { UserServicesService } from 'src/app/services/user-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-av-directory',
  templateUrl: './av-directory.component.html',
  styleUrls: ['./av-directory.component.css']
})
export class AvDirectoryComponent implements OnInit {
  twitterUrl: string | null = null;
  facebookUrl: string | null = null;
  instagramUrl: string | null = null;
  linkedInUrl: string | null = null;
  userEmailId: string | null = null;
  imagePath: string | null = null;
  userData: any[] = [];
  pagedUserData: any[] = [];
  clickedUserData: any[] = [];
  profileData: any[] = [];
  pageSize: number = 10;
  totalRecords: number = 0;
  companyName!: string;
  profileImage: any[] = [];
  showClickedData: boolean = false;
  showFilters: boolean = true;
  searchBox: boolean = true;
  showSpinner: boolean = false;
  filterTerm: string = '';
  emptyLinks: string = 'The user has not updated';
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private faService: FaServiceService,
    private userService: UserServicesService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getData(0, this.pageSize);
  }

  getData(offset: number, limit: number): void {
    this.showSpinner = true;
    this.faService.getUserDetails(offset / limit + 1, limit, this.filterTerm).subscribe((response: any) => {
      console.log('Response from server:', response);
      this.userData = response.records;
      this.totalRecords = response.totalCount;
      this.pagedUserData = this.userData;
      this.showSpinner = false;
    });
  }

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex + 1; // PageIndex starts from 0, so increment by 1
    const pageSize = event.pageSize;
    this.getData((pageIndex - 1) * pageSize, pageSize);
  }

  applyFilter(): void {
    this.getData(0, this.pageSize);
  }

  showDetails(item: any): void {
    this.searchBox = false;
    this.showSpinner = true;
    this.showClickedData = true;
    console.log('Clicked Item Details:', item);
    const emailId = item.emailId;
    this.imagePath = item.imagePath;
    this.userService.getSocialMediaProfile(emailId).subscribe((response: any) => {
      this.showSpinner = false;
      if (response.records.length !== 0) {
        const records = response.records[0];
        this.twitterUrl = records.twitter || null;
        this.facebookUrl = records.faceBook || null;
        this.instagramUrl = records.instagram || null;
        this.linkedInUrl = records.linkedIn || null;
      }
    });

    this.clickedUserData = [item];
  }

  onBack(): void {
    this.companyName = '';
    this.instagramUrl = '';
    this.facebookUrl = '';
    this.twitterUrl = '';
    this.linkedInUrl = '';
    this.searchBox = true;
    this.showClickedData = false;
    this.imagePath = '';
  }
}
