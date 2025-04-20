import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  http: HttpClient = inject(HttpClient);

  private baseApi = 'https://c.jordanwebmaster.com/flexihire/public/api';


  // onGetcompanies(){
  //   return this.http.get(this.baseApi + '/companies');
  // }
  onGetCompanyByUrl(pageNumber){
    return this.http.get(this.baseApi + '/companies' + '?page=' + pageNumber);
  }
  onGetCompanyById(id){
    return this.http.get(this.baseApi + '/company/' + id);
  }
  // onGetusers(){
  //   return this.http.get(this.baseApi + '/users');
  // }
  onGetUsersByUrl(pageNumber){
    return this.http.get(this.baseApi + '/users' + '?page=' + pageNumber);
  }
  onGetUserById(id){
    return this.http.get(this.baseApi + '/user/' + id);
  }
  onGetJobs(){
    return this.http.get(this.baseApi + '/all-jobs');
  }
  onGetJobsByUrl(pageNumber){
    return this.http.get(this.baseApi + '/all-jobs' + '?page=' + pageNumber);
  }
  onGetJobById(id){
    return this.http.get(this.baseApi + '/company/get-job/' + id);
  }
}
