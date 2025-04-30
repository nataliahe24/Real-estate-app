import { Component } from '@angular/core';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    // Here you would typically send the data to a service
    this.resetForm();
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
} 