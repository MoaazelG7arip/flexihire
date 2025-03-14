import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the actor's role */
export const PasswordMatchValidator: ValidatorFn = 
    (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('password_confirmation')?.value;
        
        // Return an error object if passwords don't match
        return password === confirmPassword ? null : { passwordMismatch: true };
  };


