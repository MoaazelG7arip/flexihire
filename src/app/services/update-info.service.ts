import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateInfoService {

  http: HttpClient = inject(HttpClient);

  // private baseApi = "https://c.jordanwebmaster.com/flexihire/public/api/profile";
  private baseApi = "http://www.flexihire.me/api/profile";
  private auth_token; 
  
  onUpdateImage(formData:object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-profile-image", formData, {headers})
  }
  onUpdateBackground(formData:object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-profile-background-image", formData, {headers})
  }
  onUpdateName(fullname: object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-name", fullname, {headers})
  }
  onUpdateDesc(description: object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-profile-description", description, {headers})
  }
  onUpdateLocation(location: object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-profile-location", location, {headers})
  }
  onUpdateEmail(email: object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    });
    return this.http.post( this.baseApi + "/update-email", email, {headers});
  }
  onUpdatePass(formData){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-password", formData, {headers})
  }
  onUpdateCV(formData:object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + "/update-profile-cv", formData, {headers})
  }
  onGetSkillsAndJobs(){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    let baseApi = "https://c.jordanwebmaster.com/flexihire/public/api/get-skills-jobs";

    return this.http.get(baseApi);
  }
  onUpdateSkillsAndJob(formData:object){
    this.auth_token = JSON.parse(localStorage.getItem('user')).token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth_token}`
    })
    return this.http.post( this.baseApi + '/update-skills-job', formData, {headers})
  }


}
