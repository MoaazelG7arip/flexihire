import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  MaxValidator,
  MinValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UpdateInfoService } from '../../../../../services/update-info.service';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { NotificationComponent } from '../../../../../shared/notification/notification.component';
import { JobService } from '../../../../../services/job.service';
import { EditorModule } from '@tinymce/tinymce-angular';




@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    NotificationComponent,
    EditorModule,
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css',
})
export class AddJobComponent {


@ViewChild('editorElement') editorElement!: ElementRef;



  
  jobForm: FormGroup;
  newSkill = '';
  allSkills = [];
  selectedSkills = [];
  loading = false;
  notification = { isFound: false, message: '', status: '' };

  init = {
    plugins: [
      // Core editing features
      'anchor','autolink','charmap','codesample','emoticons','image','link','lists','media','searchreplace','table','visualblocks','wordcount',
      // Your account includes a free trial of TinyMCE premium features
      // Try the most popular premium features until Jul 1, 2025:
      'checklist','mediaembed','casechange','formatpainter','pageembed','a11ychecker','tinymcespellchecker','permanentpen','powerpaste','advtable','advcode','editimage','advtemplate','ai','mentions','tinycomments','tableofcontents','footnotes','mergetags','autocorrect','typography','inlinecss','markdown','importword','exportword','exportpdf',
    ],
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    ai_request: (request, respondWith) =>
      respondWith.string(() =>
        Promise.reject('See docs to implement AI Assistant')
      ),
  };

  updateInfo: UpdateInfoService = inject(UpdateInfoService);
  jobService: JobService = inject(JobService);

  @Output() innerState: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      skills: this.fb.array([], Validators.required),
      payment_period: ['monthly', Validators.required],
      payment_currency: ['USD', Validators.required],
      min_salary: ['', Validators.required],
      max_salary: ['', Validators.required],
      salary_negotiable: [false, Validators.required],
      hiring_multiple_candidates: [true, Validators.required],
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
        console.error('Error getting skills:', err);
      },
    });
    this.editSkillsAndJob();
  }

  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Form Submitted', this.jobForm.value);
      // Handle form submission here
      this.loading = true;
      console.log(this.jobForm.value);
      this.jobService.onAddJob(this.jobForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);

          this.notification = {
            isFound: true,
            message: res['message'] || 'Job added successfully',
            status: 'success',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);

          this.innerState.emit('done');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding job:', err);

          this.notification = {
            isFound: true,
            message: err.error.message || 'Job not added successfully',
            status: 'alert',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);
        },
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
  editSkillsAndJob() {
    this.skills.clear();
    this.selectedSkills.forEach((skill) => {
      this.skills.push(new FormControl(skill['name']));
    });
  }

  get skills() {
    return this.jobForm.get('skills') as FormArray;
  }
  get availableSkills() {
    let av = [];
    for (let i = 0; i < this.allSkills.length; i++) {
      for (let j = 0; j < this.selectedSkills.length; j++) {
        if (this.selectedSkills[j].id == this.allSkills[i].id) {
          av.push(this.allSkills[i]);
        }
      }
    }
    return this.allSkills.filter((skill) => {
      return !av.includes(skill);
    });
  }

  onClose() {
    this.innerState.emit('');
  }

}
