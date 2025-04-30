import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {

  constructor() { }

  logForm : EventEmitter<any> = new EventEmitter();
  regForm : EventEmitter<any> = new EventEmitter();
  forgotForm : EventEmitter<any> = new EventEmitter();
  resetForm : EventEmitter<any> = new EventEmitter();
  loading : EventEmitter<boolean> = new EventEmitter();
  notification : EventEmitter<any> = new EventEmitter();
  addInfoEmitter: EventEmitter<any> = new EventEmitter();


  getLogForm(form: any){
    this.logForm.emit(form);
  }
  getRegisterForm(form: any){
    this.regForm.emit(form);
  }
  getForgetForm(form: any){
    this.forgotForm.emit(form);
  }
  getResetForm(form: any){
    this.resetForm.emit(form);
  }


  getLoading(status){
    this.loading.emit(status); 
  }
  getNotification(notification){
    this.notification.emit(notification);
  }
  onEmitAddInfo(data: any){
    this.addInfoEmitter.emit(data);
  }

}
