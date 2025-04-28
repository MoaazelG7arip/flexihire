import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  http: HttpClient = inject(HttpClient);

  private baseApi = "https://c.jordanwebmaster.com/flexihire/public/api";
  private auth_token;


  onApplyForJob(job){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.post(this.baseApi + '/dashboard/company/apply-for-job', job, { headers });
  }

  onGetMyApplications(){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.get(this.baseApi + '/dashboard/user/my-applies', { headers });
  }

  onGetMyJobsByUrl(page){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.get(this.baseApi + '/dashboard/company/my-jobs?page='+page, { headers });
  }
  onAddJob(jobForm){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.post(this.baseApi + '/company/create-job', jobForm, { headers });
  }
  onEditJob(jobformUpdated, id){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.post(this.baseApi + '/company/update-job/'+ id, jobformUpdated, { headers });
  }
  onDeleteJob(id){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.post(this.baseApi + '/company/delete-job/'+ id, null, { headers });
  }


  onShowJobApplicantsByUrl(id, page){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });
    
    return this.http.get(this.baseApi + '/dashboard/company/my-job-proposals/'+ id+'?page='+page, { headers });
  }


}
