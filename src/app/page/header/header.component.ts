import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Collapse, Dropdown, initTWE} from "tw-elements";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InformationService } from '../../services/information.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user;
  loggedIn = false;
  image_url = null;


  @Output() onloading : EventEmitter<boolean> = new EventEmitter();
  loading: boolean = false;
  @Output() onNotification : EventEmitter<object> = new EventEmitter();
  notification = {isFound: false, message: '', status: ''};

  allNotifications = [];
  unreadCount = null;

  


  authService: AuthService = inject(AuthService);
  informationService: InformationService = inject(InformationService);
  router: Router = inject(Router);
  ngOnInit(): void {
    initTWE({ Collapse, Dropdown }); // Initialize required components
    
    let user = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.loggedIn = true;
      this.authService.user.subscribe((data)=>{
        if(data){
          this.user = data;
          this.image_url = data.user.image_url;
        }
      })
    }

    this.fetchNotifications();
  }

  fetchNotifications() {
    this.loading = true;
    this.onloading.emit(this.loading);
    this.informationService.onGetNotifications().subscribe({
      next: res => {
        console.log(res);
        this.allNotifications = res['notifications'];
        this.unreadCount = res['unread_count'];
        this.loading = false;
        this.onloading.emit(this.loading);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.onloading.emit(this.loading);
        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      }
    });
  }

  onSeeNotification(id) {

    const notifIndex = this.allNotifications.findIndex(n => n.id === id);
    this.informationService.onSeeNotification(id).subscribe({
      next: res => {
        console.log(res);
        if (notifIndex !== -1) {
          this.allNotifications[notifIndex].read_at = true;
          this.unreadCount = Math.max(0, (this.unreadCount || 1) - 1);
        }

        this.notification = {
          isFound: true,
          message: res['message'] || 'Notification marked as read',
          status: 'success',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      },
      error: err => {
        console.error(err);

        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      }
    });
  }
  onDeleteNotification(id) {

    const notifIndex = this.allNotifications.findIndex(n => n.id === id);
    this.informationService.onDeleteNotification(id).subscribe({
      next: res => {
        console.log(res);

        this.allNotifications = this.allNotifications.filter(n => n.id !== id);
        
        this.unreadCount = res['unread_count']

        this.notification = {
          isFound: true,
          message: res['message'] || 'Notification marked as read',
          status: 'success',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      },
      error: err => {
        console.error(err);

        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      }
    });
  }
  onSeeAllNotifications() {

    this.informationService.onSeeAllNotification().subscribe({
      next: res => {
        console.log(res);
        this.allNotifications.forEach(notification => {
          notification.read_at = true;
        });
        this.unreadCount = 0;
        this.notification = {
          isFound: true,
          message: res['message'] || 'Notifications marked as read',
          status: 'success',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      },
      error: err => {
        console.error(err);

        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      }
    });
  }
  onDeleteAllNotifications() {

    this.informationService.onDeleteAllNotification().subscribe({
      next: res => {
        console.log(res);

        this.allNotifications = [];
        this.unreadCount = 0;
        

        this.notification = {
          isFound: true,
          message: res['message'] || 'Notification marked as read',
          status: 'success',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      },
      error: err => {
        console.error(err);

        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        this.onNotification.emit(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
          this.onNotification.emit(this.notification);
        }, 3500);
      }
    });
  }


  onLogout(){
    this.loading = true;
    this.onloading.emit(this.loading);
    let user = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.authService.onLogout().subscribe({
        next: res => {
          console.log(res);
          this.loading = false;
          this.onloading.emit(this.loading);
          localStorage.removeItem('user');
          this.authService.user.next(null);
          this.loggedIn = false;
          this.router.navigate(['/auth/welcome']);
          // end
          this.notification = {
            isFound: true,
            message: res['message'] || 'Login Successfully',
            status:'success'
          };
          this.onNotification.emit(this.notification);
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
            this.onNotification.emit(this.notification);
          }, 3500);

        },
        error: err => {
          console.error(err);
          this.loading = false;


          localStorage.removeItem('user');
          this.authService.user.next(null);
          this.loggedIn = false;
          this.router.navigate(['/auth/welcome']);




          this.onloading.emit(this.loading);
          this.notification = {
            isFound: true,
            message: err.error.message,
            status: 'alert',
          };
          this.onNotification.emit(this.notification);
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
            this.onNotification.emit(this.notification);
          }, 3500);
        }
      })
    }
  }





}
