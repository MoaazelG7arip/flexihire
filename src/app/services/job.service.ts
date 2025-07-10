import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  http: HttpClient = inject(HttpClient);

  private baseApi = "http://www.flexihire.me/api";
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


  onUpdateProposalStatus(id, status){

        this.auth_token = JSON.parse(localStorage.getItem('user')).token;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.auth_token}`,
        });

    return this.http.post(this.baseApi + '/dashboard/company/update-application-status/'+ id, {status}, { headers });
  }

  onSaveJob(job_id){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.post(this.baseApi + '/profile/saved-job/toggle-saved-job', {job_id}, { headers });
  }

  onReviewCompany(review){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.post(this.baseApi + '/reviews/create', review, { headers });
  }

  onFollowCompany(company_id){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.post(this.baseApi + '/follow/toggle-follow', {company_id}, { headers });
  }
  onGetReviews(){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.get(this.baseApi + '/reviews/my-reviews', { headers });
  }

  onDeleteReview(reviewId: number) {
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.post(this.baseApi + '/reviews/delete/' + reviewId, null, { headers });
  }

  onRankJobs(jobId, page){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });

    return this.http.get(this.baseApi + '/dashboard/company/rank-job-proposals/' + jobId+'?page='+page, { headers });
  }


}
