import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  submitted = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.auth.register(
      this.form.value.name,
      this.form.value.email,
      this.form.value.password
    ).subscribe({
      next: () => {
        this.success = 'Registro exitoso, redirigiendo a login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => this.error = err.error.message || 'Error en el registro'
    });
  }
}
