import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMsg = '';
  successMsg = '';
  imageBase = environment.imageBaseUrl;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    const { name, email, password } = this.registerForm.value;
    this.auth.register(name, email, password).subscribe({
      next: () => {
        this.successMsg = 'Registro correcto. Redirigiendo al login…';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => this.errorMsg = err.error?.message || 'Error en el registro'
    });
  }
}
