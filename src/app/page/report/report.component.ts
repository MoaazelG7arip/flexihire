import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationComponent } from "../../shared/notification/notification.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {

  reportForm: FormGroup;
  loading = false;
  notification = { isFound: false, message: '', status: '' };
  userId;
  @Output() innerState: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<string> = new EventEmitter<string>();
  

  informationService: InformationService = inject(InformationService);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.initializeForm();
    console.log(this.userId)
  }


  initializeForm(): void {
    this.reportForm = this.fb.group({
      reported_user_id: [this.userId],
      reason: ['', Validators.required],
      images: this.fb.array([])
    });
  }

  get imageControls() {
    return (this.reportForm.get('images') as FormArray).controls;
  }

  get imagesArray() {
    return this.reportForm.get('images') as any;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Clear existing images
      while (this.imagesArray.length > 0) {
        this.imagesArray.removeAt(0);
      }
      
      // Add new images
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.imagesArray.push(this.fb.group({
          file: file,
          preview: this.createImagePreview(file)
        }));
      }
    }
  }

  private createImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      console.log('Form Submitted', this.reportForm.value);

      const formData = new FormData();
      
      // 1. Append regular form values
      formData.append('reason', this.reportForm.get('reason')?.value);
      formData.append('reported_user_id', this.userId);
      
      // 2. Append image files
      const images = this.imagesArray.value;
      images.forEach((image: any, index: number) => {
        if (image.file instanceof File) {
          formData.append(`images[${index}]`, image.file, image.file.name);
        }
      });

      // 3. Debugging: Log formData contents
      this.logFormDataContents(formData);

      // Here you would typically send formData to your backend
      console.log('Form submitted:', formData);



    // Handle form submission here
    this.loading = true;
    this.informationService.onReportUser(formData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);

          this.innerState.emit(res);
          this.notification = {
            isFound: true,
            message: res['message'] || 'user reported successfully',
            status: 'success',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);

        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding job:', err);
          this.notification = {
            isFound: true,
            message: err.error.message || 'User did not reported successfully',
            status: 'alert',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);
        },
      });
    }
  }

   private logFormDataContents(formData: FormData): void {
    console.log('--- FormData Contents ---');
    
    // Log regular fields
    console.log('Reason:', formData.get('reason'));
    console.log('Message:', formData.get('message'));
    
    // Log image files
    for (const entry of (formData as any).entries()) {
      const [key, value] = entry;
      if (value instanceof File) {
        console.log(`File ${key}:`, value.name, value.type, value.size + ' bytes');
      }
    }
    
    console.log('-------------------------');
  }

  onClose(){
    this.close.emit('')
  }
}
