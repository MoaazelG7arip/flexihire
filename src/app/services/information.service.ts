import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  http: HttpClient = inject(HttpClient);

  private baseApi = 'https://c.jordanwebmaster.com/flexihire/public/api';
  private auth_token;


  onGetCompanyByUrl(pageNumber, search){
    return this.http.get(this.baseApi + '/companies' + '?page=' + pageNumber + '&search=' + search);
  }
  onGetCompanyById(id){
    return this.http.get(this.baseApi + '/company/' + id);
  }



  onGetUsersByUrl(pageNumber, search){
    return this.http.get(this.baseApi + '/users' + '?page=' + pageNumber + '&search=' + search);
  }
  onGetUserById(id){

    
    return this.http.get(this.baseApi + '/user/' + id);
  }
  
  
  
  // onGetJobs(){
    //   return this.http.get(this.baseApi + '/all-jobs');
    // }
    onGetJobsByUrl(pageNumber, search){
      return this.http.get(this.baseApi + '/all-jobs' + '?page=' + pageNumber + '&search=' + search);
    }
    onGetJobById(id){
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.get(this.baseApi + '/company/get-job/' + id, { headers });
    }
}
