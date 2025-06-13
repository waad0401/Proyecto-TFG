import { Component }           from '@angular/core';
import { CommonModule }        from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService }         from '../../services/auth.service';
import { Router }              from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Aquí ya `this.fb` está disponible
    this.registerForm = this.fb.group({
      name:     ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.auth.register(name, email, password).subscribe({
        next: () => {
          this.success = 'Usuario creado';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: () => this.error = 'Error al crear usuario'
      });
    }
  }
}
