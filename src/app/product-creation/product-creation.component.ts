import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';
import { PopUpService } from '../pop-up.service';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {
  productForm!: FormGroup;
  images: { file: File, preview: string }[] = [];
  headers: HttpHeaders;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthServiceService,
    private status: PopUpService
  ) {
    this.headers = new HttpHeaders({ 'userauth': this.auth.GetToken() });
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9]+)(,([a-zA-Z0-9]+))*$/)]]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length + this.images.length > 10) {
      alert('You can upload up to 10 images only.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file, preview: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.createFormData();
      this.isLoading = true;  // Start loading state
      this.api.AddCar(formData, this.headers).subscribe(
        (response) => {
          if (response.body) {
            this.status.Successful(response.body['successful']);
            this.resetForm();
          }
        },
        (error) => {
          console.error('Error creating product', error);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      alert('Please complete the form before submitting.');
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.productForm.value.title);
    formData.append('description', this.productForm.value.description);
    formData.append('tags', this.productForm.value.tags);
    this.images.forEach(image => formData.append('images', image.file, image.file.name));
    return formData;
  }

  private resetForm(): void {
    this.productForm.reset();
    this.images = [];
  }
}
