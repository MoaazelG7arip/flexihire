import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  http: HttpClient = inject(HttpClient);

  private baseApi = 'http://www.flexihire.me/api';
  private auth_token;


  onGetCompanyByUrl(pageNumber, search, searchLocation) {
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    return this.http.get(this.baseApi + '/auth-companies' + '?page=' + pageNumber + '&search=' + search + '&searchLocation=' + searchLocation, { headers });
  }
  
  onGetCompanyById(id){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    return this.http.get(this.baseApi + '/auth-company/' + id, { headers });
  }



  onGetUsersByUrl(pageNumber, search, jobSearch){
    return this.http.get(this.baseApi + '/users' + '?page=' + pageNumber + '&search=' + search + '&jobSearch=' + jobSearch);
  }
  onGetUserById(id){
    return this.http.get(this.baseApi + '/user/' + id);
  }
  
  
  
    onGetJobsByUrl(pageNumber, search, searchLocation, minSalary, maxSalary) {

      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });

      return this.http.get(this.baseApi + '/auth-jobs' + '?page=' + pageNumber + '&search=' + search + 
        '&searchLocation=' + searchLocation  + '&minSalary=' + minSalary + '&maxSalary=' + maxSalary, { headers });
    }
    onGetJobById(id){
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.get(this.baseApi + '/company/get-job/' + id, { headers });
    }

    
    onGetTopCompanies() {
      return this.http.get(this.baseApi + '/top-companies');
    }
    onGetRecommendedJobs() {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.get(this.baseApi + '/ai/recommended-jobs', { headers });
    }
    onGetSavedJobs() {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.get(this.baseApi + '/profile/saved-job/saved-jobs', { headers });
    }
    onGetNotifications() {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.get(this.baseApi + '/notifications', { headers });
    }
    onSeeNotification(id) {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/notifications/mark-as-read/' + id, null,{ headers });
    }
    onDeleteNotification(id) {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/notifications/delete/' + id, null,{ headers });
    }
    onSeeAllNotification() {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/notifications/mark-all-as-read' , null,{ headers });
    }
    onDeleteAllNotification() {
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/notifications/delete-all' , null,{ headers });
    }
    onReportUser(formVal){
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/reports/create', formVal, {headers})
    }
    onContactUs(formVal){
      this.auth_token = JSON.parse(localStorage.getItem('user')).token;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      });
      return this.http.post(this.baseApi + '/contact-us', formVal, {headers})
    }
}
