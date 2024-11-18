import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { PopUpService } from '../pop-up.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() product!: {
    id: number,
    user_id: number,
    url_id: number,
    title: string,
    description: string,
    tags: string[],
    images: string[]
  };

  editchangesupdate: Record<string, any> = {};
  isEditing = false;
  originalProduct: any = null;
  removedIndices: number[] = [];
  isLoading: boolean = false

  headers: HttpHeaders;

  constructor(private api: ApiService, private status: PopUpService, private auth: AuthServiceService, private router: Router) {
    this.headers = new HttpHeaders({ 'userauth': auth.GetToken() })
  }

  ngOnInit(): void {
    this.editchangesupdate = {
      id: this.product.id,
      user_id: this.product.user_id,
      url_id: this.product.url_id
    };
    this.originalProduct = JSON.parse(JSON.stringify(this.product));
  }

  addTag(): void {
    if (!this.product.tags) {
      this.product.tags = [];
    }
    this.product.tags.push('');
  }

  removeTag(index: number): void {
    if (this.product.tags && index > -1) {
      this.product.tags.splice(index, 1);
    }
  }

  trackByFn(index: number, item: string): number {
    return index;
  }

  onEdit(): void {
    if (this.isEditing) {
      const changes = this.getSpecificChanges();

      if (Object.keys(changes).length > 0 || this.removedIndices.length > 0) {
        this.isLoading = true;

        Object.assign(this.editchangesupdate, changes);

        if (this.removedIndices.length > 0) {
          this.editchangesupdate['deleted'] = this.removedIndices;
        }
        if ('tags' in this.editchangesupdate) {
          this.editchangesupdate['tags'] = this.editchangesupdate['tags'].join(", ")
        }

        this.api.UpdateCar(this.editchangesupdate, this.headers).subscribe(
          response => {
            if ('successful' in response.body) {
              this.status.Successful(response.body['successful']);
              this.originalProduct = JSON.parse(JSON.stringify(this.product));
              this.editchangesupdate = {
                id: this.product.id,
                user_id: this.product.user_id,
                url_id: this.product.url_id
              };
              this.removedIndices = [];
            } else {
              this.status.Error("Something went wrong");
              this.router.navigate(['/']);
            }
            this.isLoading = false;
          }
        );
      } else {
        console.log("No changes made.");
      }
    } else {
      this.originalProduct = JSON.parse(JSON.stringify(this.product));
    }

    this.isEditing = !this.isEditing;
  }



  getSpecificChanges(): Record<string, any> {
    const changes: Record<string, any> = {};
    const fieldsToCheck: (keyof typeof this.product)[] = ['title', 'description', 'tags'];

    if (this.originalProduct) {
      for (const field of fieldsToCheck) {
        if (JSON.stringify(this.product[field]) !== JSON.stringify(this.originalProduct[field])) {
          changes[field] = this.product[field];
        }
      }
    }
    return changes;
  }

  removeImage(url: string): void {

    if (this.isEditing && this.product.images && this.product.images.length > 0) {
      const index = this.product.images.indexOf(url);
      if (index > -1) {
        this.product.images.splice(index, 1);
        this.removedIndices.push(this.originalProduct.images.indexOf(url) + 1);
      }

    }
  }

}