import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateInfoService } from '../../../../../services/update-info.service';
import { InformationService } from '../../../../../services/information.service';
import { LoaderComponent } from "../../../../../shared/loader/loader.component";
import { NotificationComponent } from "../../../../../shared/notification/notification.component";
import { CommonModule } from '@angular/common';
import { JobService } from '../../../../../services/job.service';

@Component({
  selector: 'app-edit-job',
  standalone: true,
  imports: [LoaderComponent, NotificationComponent,ReactiveFormsModule, CommonModule],
  templateUrl: './edit-job.component.html',
  styleUrl: './edit-job.component.css'
})
export class EditJobComponent {


    editJobForm: FormGroup;
    newSkill = '';
    allSkills = [];
    selectedSkills = [];
    loading = false;
    notification = {isFound: false, message: '', status: ''};
  
  
    updateInfo :UpdateInfoService = inject(UpdateInfoService);
    jobService : JobService = inject(JobService);
    
    @Input() job = null;
    @Output() innerState :EventEmitter<string> = new EventEmitter<string>();
  
  
    constructor(private fb: FormBuilder) {

    }
  
  
  
    ngOnInit(): void {
      this.loading = true;
      this.updateInfo.onGetSkillsAndJobs().subscribe({
        next: (res) => {
          this.loading = false;
          this.allSkills = res['skills'];
          console.log(res);
          this.selectedSkills = this.job.skills;
          console.log(this.selectedSkills);
          this.makeUpdateForm();
          
        },
        error: (err) => {
          this.loading = false;
          console.error('Error getting skills and jobs:', err)
        }
      });
      this.editSkillsAndJob();
    }
    makeUpdateForm(){ 
      this.editJobForm = this.fb.group({
        title: [this.job.title,Validators.required],
        location: [this.job.location, Validators.required],
        description: [this.job.description, Validators.required],
        skills: this.fb.array([]),
        payment_period: [this.job.payment_period, Validators.required],
        payment_currency: [this.job.payment_currency, Validators.required],
        min_salary: [this.job.min_salary, Validators.required],
        max_salary: [this.job.max_salary, Validators.required],
        salary_negotiable:[this.job.salary_negotiable, Validators.required],
        hiring_multiple_candidates: [this.job.hiring_multiple_candidates, Validators.required]
      });
    }
  
  
  
    onSubmit() {
      if (this.editJobForm.valid) {
        console.log('Form Submitted', this.editJobForm.value);
        // Handle form submission here
        this.loading = true;
        console.log(this.editJobForm.value);
        this.jobService.onEditJob(this.editJobForm.value, this.job.id).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
  
            this.notification = {
              isFound: true, 
              message: res['message'] || "Job updated successfully",
              status:'success'
            };
            setTimeout(() => {
              this.notification = {isFound: false, message: '', status: ''};
            }, 3500);
  
  
            this.innerState.emit('done');
          },
          error: (err) => {
            this.loading = false;
            console.error('Error adding job:', err);
  
            this.notification = {
              isFound: true, 
              message: err.error.message || "Job not updated successfully",
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
      this.skills?.clear();
      this.selectedSkills?.forEach(skill => {
        // this.skills?.push(new FormControl(skill['name']));
        if(typeof skill == 'string'){
          this.skills?.push(new FormControl(skill));
        }else {
          this.skills?.push(new FormControl(skill['name']));
        }
      });
    }
  
    get skills() {
      return this.editJobForm?.get('skills') as FormArray;
    }
    get availableSkills() {
      let av = [];

      for(let i=0; i<this.allSkills.length; i++) {
        for(let j=0; j<this.selectedSkills.length; j++) {
          // if(this.selectedSkills[j].id == this.allSkills[i].id) {
          if(this.selectedSkills[j] == this.allSkills[i].name) {
            av.push(this.allSkills[i])
          }
        }
      }
      return this.allSkills?.filter(skill =>{
        return !av.includes(skill)
      })
    }
  
    onClose(){
      this.innerState.emit('');
    }
  
}
