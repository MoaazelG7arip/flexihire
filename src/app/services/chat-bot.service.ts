import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {


  private apiUrl = 'https://b0ce-156-197-188-232.ngrok-free.app/query'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getResponse(body) {
    return this.http.post(this.apiUrl, body)
  }

}
