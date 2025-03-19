import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {


  private apiUrl = 'YOUR_API_ENDPOINT'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getResponse(message: string): Promise<string> {
    return this.http.post<{response: string}>(this.apiUrl, { message })
      .toPromise()
      .then(res => res?.response || 'No response');
  }

}
