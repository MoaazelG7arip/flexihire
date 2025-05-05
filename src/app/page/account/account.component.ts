import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateInfoService } from '../../services/update-info.service';
import { NotificationComponent } from "../../shared/notification/notification.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PasswordMatchValidator } from '../../validators/confimPassword.validator';
import { RouterLink } from '@angular/router';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { BridgeService } from '../../services/bridge.service';



@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, NotificationComponent, LoaderComponent, CommonModule, ReactiveFormsModule, RouterLink, ProgressBarComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  governorates: string[] = [
    'Cairo',
    'Alexandria',
    'Giza',
    'Sharkia',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Fayoum',
    'Gharbia',
    'Ismailia',
    'Menofia',
    'Minya',
    'Qaliubiya',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
    'South Sinai',
    'Kafr El Sheikh',
    'Matrouh',
    'Luxor',
    'Qena',
    'North Sinai',
    'Sohag'
  ];

  user= null;
  image_url = null;
  background_url = null;
  first_name = '';
  last_name = '';
  description = '';
  location = '';
  role = '';
  allJobs = [];
  allSkills = [];
  selectedSkills = [];
  addInfo = false;
  selectedJob = null;
  loading: boolean = false;
  notification = {isFound: false, message: '', status: ''};
  
  

  selectedFile: File | null = null;
  selectedBackground: File | null = null;
  cvFile: File | null = null;
  updateInfo : UpdateInfoService = inject(UpdateInfoService);
  authService: AuthService = inject(AuthService);
  bridgeService: BridgeService = inject(BridgeService);
  changePasswordForm: FormGroup;
  
  fb : FormBuilder = inject(FormBuilder);
  form: FormGroup;


    constructor() {
      this.changePasswordForm = new FormGroup(
        {
          old_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
          password: new FormControl('', [Validators.required, Validators.minLength(8)]),
          password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)]),
        },{
          validators : PasswordMatchValidator,
        }
      );

      this.form = this.fb.group({
        skill_id: this.fb.array([],Validators.required),
        job_id: this.fb.control(null, Validators.required)
      });
      if (JSON.parse(sessionStorage.getItem('addInfo'))) {
        this.addInfo = true;
      }
    }


  ngOnInit(): void {
    this.loading = true;
      this.authService.user?.subscribe((data)=>{
        // this.loading = false;
        if(data){

      
      this.user = data;
      this.image_url = data.user?.image_url;
      this.background_url = data.user?.background_url;
      this.first_name = data.user?.first_name;
      this.last_name = data.user?.last_name;
      this.description = data.user?.description;
      this.location = data.user?.location;
      this.selectedSkills = data.user?.skills;
      this.selectedJob = data.user?.job;
      this.role = data.user?.roles[0];
      if(this.selectedJob){
        this.form.get('job_id')?.setValue(this.selectedJob['id']);
      }
    }
  })
    
    this.updateInfo.onGetSkillsAndJobs().subscribe({
      next: (res) => {
        this.loading = false;
        this.allSkills = res['skills'];
        this.allJobs = res['jobs'];
      },
      error: (err) => {
        this.loading = false;
        console.error('Error getting skills and jobs:', err)
      }
    });
    this.editSkillsAndJob();

  }

  onBackgroundSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedBackground = input.files[0];
    }
    this.onUpdateBackground()
  }
  onUpdateBackground(): void {
    if (this.selectedBackground) {
      const formData = new FormData();
      formData.append('background_image', this.selectedBackground);
      this.loading = true;      
      this.updateInfo.onUpdateBackground(formData).subscribe({
        next: (res) => {
          console.log('Upload successful:', res)
          this.loading = false;
          
          const user = localStorage.getItem('user');
          if(user){
            const userData = JSON.parse(user);
            userData.user.background_url = res['background_url'];
            localStorage.setItem('user', JSON.stringify(userData));
            this.authService.user.next(userData);
          }
          this.notification = {
            isFound: true, 
            message: res['message'] || "Background Uploaded Successfully",
            status:'success'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        },
        error: (err) => {
          console.error('Error uploading file:', err)
          this.loading = false;
          this.notification = {
            isFound: true, 
            message: err.error.message || "Background Upload Failed",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        }
      });
    }
  }
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    this.onSubmit()
  }
  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.loading = true;      
      this.updateInfo.onUpdateImage(formData).subscribe({
        next: (res) => {
          console.log('Upload successful:', res)
          this.loading = false;
          
          const user = localStorage.getItem('user');
          if(user){
            const userData = JSON.parse(user);
            userData.user.image_url = res['image_url'];
            localStorage.setItem('user', JSON.stringify(userData));
            this.authService.user.next(userData);
          }
          this.notification = {
            isFound: true, 
            message: res['message'] || "Picture Uploaded Successfully",
            status:'success'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        },
        error: (err) => {
          console.error('Error uploading file:', err)
          this.loading = false;
          this.notification = {
            isFound: true, 
            message: err.error.message || "Picture Upload Failed",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        }
      });
    }
  }

  onUpdateName(){
    let fullname = {
      first_name : this.first_name,
      last_name :this.last_name
    }
    this.loading = true;
    this.updateInfo.onUpdateName(fullname).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Name updated successfully:', res)

                  
        const user = localStorage.getItem('user');
        if(user){
          const userData = JSON.parse(user);
          userData.user.first_name = res['first_name'];
          userData.user.last_name = res['last_name'];
          localStorage.setItem('user', JSON.stringify(userData));
          this.authService.user.next(userData);
        }

        this.notification = {
          isFound: true, 
          message: res['message'] || "Name Changed Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
  
      },
      error: (err) => {
        this.loading = false;
        this.notification = {
          isFound: true, 
          message: err.error.message || "Name Upload Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        
      }
    });
  }
  onUpdateDesc(){
    this.loading = true;
    let description = {description: this.description};
    this.updateInfo.onUpdateDesc(description).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Name updated successfully:', res)

        const user = localStorage.getItem('user');
        if(user){
          const userData = JSON.parse(user);
          userData.user.description = res['description'];
          localStorage.setItem('user', JSON.stringify(userData));
          this.authService.user.next(userData);
        }

        this.notification = {
          isFound: true, 
          message: res['message'] || "Description Changed Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
  
      },
      error: (err) => {
        this.loading = false;
        this.notification = {
          isFound: true, 
          message: err.error.message || "Description Upload Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        
      }
    });
  }
  onUpdateLocation(){
    this.loading = true;
    let Location = {location: this.location};
    this.updateInfo.onUpdateLocation(Location).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Location updated successfully:', res)

        const user = localStorage.getItem('user');
        if(user){
          const userData = JSON.parse(user);
          userData.user.location = res['location'];
          localStorage.setItem('user', JSON.stringify(userData));
          this.authService.user.next(userData);
        }

        this.notification = {
          isFound: true, 
          message: res['message'] || "Location Changed Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
  
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.notification = {
          isFound: true, 
          message: err.error.message || "Location Upload Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        
      }
    });
  }
  onUpdatePassword(){
    this.loading = true;
    this.updateInfo.onUpdatePass(this.changePasswordForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Pass updated successfully:', res)

        this.notification = {
          isFound: true, 
          message: res['message'] || "Password Changed Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
  
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.notification = {
          isFound: true, 
          message: err.error.message || "Password Changed Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        
      }
    });
  }
  onCVSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvFile = input.files[0];
    }
  }
  onUpdateCV(): void {
    if (this.cvFile) {
      const formData = new FormData();
      formData.append('cv', this.cvFile);
      console.log(formData);

      this.loading = true;      
      this.updateInfo.onUpdateCV(formData).subscribe({
        next: (res) => {
          console.log('Upload successful:', res)
          this.loading = false;
          
          const user = localStorage.getItem('user');
          if(user){
            const userData = JSON.parse(user);
            userData.user.cv = res['cv'];
            localStorage.setItem('user', JSON.stringify(userData));
            this.authService.user.next(userData);
          }
          this.notification = {
            isFound: true, 
            message: res['message'] || "CV Uploaded Successfully",
            status:'success'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        },
        error: (err) => {
          console.error('Error uploading file:', err)
          this.loading = false;
          this.notification = {
            isFound: true, 
            message: err.error.message || "CV Upload Failed",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        }
      });
    }
  }

  get skill_id() {
    return this.form.get('skill_id') as FormArray;
  }
  get availableSkills() {
    let av = [];
    for(let i=0; i<this.allSkills.length; i++) {
      for(let j=0; j<this.selectedSkills.length; j++) {
        if(this.selectedSkills[j].id == this.allSkills[i].id) {
          av.push(this.allSkills[i])
        }
      }
    }
    return this.allSkills.filter(skill =>{
      return !av.includes(skill)
    })
  }
  selectjob_id(profile: object) {
    const current = this.form.get('job_id')?.value;
    this.form.patchValue({
        job_id: current === profile ? null : profile['id']
    });
    // console.log(this.form.get('job_id').value);
  }
  addSkill(skill: string) {
    if (!this.skill_id.value.includes(skill)) {
      this.selectedSkills.push(skill);
      // this.form.value.skill_id.push(skill['id']);
      this.editSkillsAndJob();
    }
  }
  removeSkill(skill: object) {
    const index = this.selectedSkills.indexOf(skill);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
      // this.form.value.skill_id.splice(index, 1);
      this.editSkillsAndJob();
    }
  }
  editSkillsAndJob(){
    this.skill_id.clear();
    this.selectedSkills.forEach(skill => {
      this.skill_id.push(new FormControl(skill['id']));
    });
  }

  onUpdateSkillsAndJob() {
    let formData = this.form.value;
    this.loading = true;
    this.updateInfo.onUpdateSkillsAndJob(formData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Skills and job updated successfully:', res)
        const user = localStorage.getItem('user');
        if(user){
          const userData = JSON.parse(user);
          userData.user.job = res['user']['jobs'][0];
          userData.user.skills = res['user']['skills'];
          localStorage.setItem('user', JSON.stringify(userData));
          this.authService.user.next(userData);
          console.log(this.selectedSkills)
        }

        this.notification = {
          isFound: true, 
          message: res['message'] || "Job And Skills Changed Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
  
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.notification = {
          isFound: true, 
          message: err.error.message || "Job And Skills Upload Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        
      }
    });
  }






  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    sessionStorage.removeItem('addInfo');
  }
}
