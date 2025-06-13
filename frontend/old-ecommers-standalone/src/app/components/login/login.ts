import { Component, OnInit }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService }                 from '../../services/auth.service';
import { Router }                      from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ CommonModule, ReactiveFormsModule ]
})
export class LoginComponent implements OnInit {
  // declaramos el form sin inicializar
  loginForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // aquí sí que fb ya está disponible, así que inicializamos el form
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe({
        next: ()   => this.router.navigate(['/']),
        error: ()  => this.error = 'Credenciales inválidas'
      });
    }
  }
}
