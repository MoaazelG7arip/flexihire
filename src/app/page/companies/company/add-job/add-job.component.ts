import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateInfoService } from '../../../../services/update-info.service';
import { LoaderComponent } from "../../../../shared/loader/loader.component";
import { InformationService } from '../../../../services/information.service';
import { NotificationComponent } from "../../../../shared/notification/notification.component";

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css'
})
export class AddJobComponent {


  jobForm: FormGroup;
  newSkill = '';
  allSkills = [];
  selectedSkills = [];
  loading = false;
  notification = {isFound: false, message: '', status: ''};


  updateInfo :UpdateInfoService = inject(UpdateInfoService);
  informationService : InformationService = inject(InformationService);
  
  governates = [
    'Cairo', 'Alexandria', 'Giza', 'Port Said', 'Suez', 
    'Luxor', 'Aswan', 'Ismailia', 'Damietta', 'Sharqia',
    'Dakahlia', 'Red Sea', 'Matrouh', 'North Sinai', 'South Sinai'
  ];

  @Output() innerState :EventEmitter<string> = new EventEmitter<string>();


  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['',Validators.required],
      location: ['', Validators.required],
      // type: ['Full Time'],
      // model: ['Hybrid'],
      description: ['', Validators.required],
      skills: this.fb.array([],Validators.required),
    });
  }



  ngOnInit(): void {
    this.loading = true;
    this.updateInfo.onGetSkillsAndJobs().subscribe({
      next: (res) => {
        this.loading = false;
        this.allSkills = res['skills'];
        console.log(res);
        
      },
      error: (err) => {
        this.loading = false;
        console.error('Error getting skills and jobs:', err)
      }
    });
    this.editSkillsAndJob();
  }



  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Form Submitted', this.jobForm.value);
      // Handle form submission here
      this.loading = true;
      console.log(this.jobForm.value);
      this.informationService.onAddJob(this.jobForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);

          this.notification = {
            isFound: true, 
            message: res['message'] || "Job added successfully",
            status:'success'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);


          this.innerState.emit('');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding job:', err);

          this.notification = {
            isFound: true, 
            message: err.error.message || "Job not added successfully",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
        }
      });
    }
  }


  addSkill(skill: string) {
    if (!this.skills.value.includes(skill)) {
      this.selectedSkills.push(skill);
      // this.form.value.skills.push(skill['id']);
      this.editSkillsAndJob();
    }
  }
  removeSkill(skill: object) {
    const index = this.selectedSkills.indexOf(skill);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
      // this.form.value.skills.splice(index, 1);
      this.editSkillsAndJob();
    }
  }
  editSkillsAndJob(){
    this.skills.clear();
    this.selectedSkills.forEach(skill => {
      this.skills.push(new FormControl(skill['name']));
    });
  }

  get skills() {
    return this.jobForm.get('skills') as FormArray;
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

  onClose(){
    this.innerState.emit('');
  }

}
