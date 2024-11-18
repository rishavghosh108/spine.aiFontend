import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { PopUpService } from '../pop-up.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  headers: HttpHeaders;
  viewState: boolean = false;
  searchTag: string = '';
  products: {
    "title": string,
    "description": string,
    "tags": string[],
    "id": number,
    "user_id": number,
    "url_id": number
  }[] = [
    {
      "title": "audi",
      "description": "my fav",
      "tags": ['own'],
      "id": 1,
      "user_id": 1,
      "url_id": 1
    }
  ];

  filteredProducts = this.products;

  constructor(private api: ApiService, public auth: AuthServiceService, private router: Router, private status: PopUpService) {
    this.headers = new HttpHeaders({ 'userauth': this.auth.GetToken() })

    this.api.Lists(this.headers).subscribe(
      (response) => {
        this.products = response.body.map((product: any) => ({
          title: product.title,
          description: product.description,
          tags: product.tags.split(','),
          id: product.id,
          user_id: product.user_id,
          url_id: product.url_id
        }));
        this.filteredProducts = this.products;
      },
      (error) => {
        this.status.Error(error.error['message'])
      }
    );
  }

  filterByKeyword() {
    const keyword = this.searchTag.trim().toLowerCase();
    
    if (keyword === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
  }
  

  DeleteProduct(id: number, user_id: number, url_id: number) {
    this.api.DeleteCar({ "id": id, "url_id": url_id, "user_id": user_id }, this.headers).subscribe(
      (response) => {
        if (response.body) {
          this.status.Successful(response.body['successful']);
          window.location.reload();
        }
      }, (error) => {
        console.error(error);
      }
    );
  }

  car!: { 'id': number, 'user_id': number, 'url_id': number, 'title': string, 'description': string, 'tags': string[], images: string[] };

  CarView(id: number, user_id: number, url_id: number) {
    this.api.ViewCar({ 'id': id, 'user_id': user_id, 'url_id': url_id }, this.headers).subscribe(
      response => {
        if (response.body) {
          this.car = {
            id: response.body.id,
            user_id: response.body.user_id,
            url_id: response.body.url_id,
            title: response.body.title,
            description: response.body.description,
            tags: response.body.tags ? response.body.tags.split(',') : [],
            images: response.body.images,
          }
          this.viewState = true;
        }
      }
    )
  }
}
