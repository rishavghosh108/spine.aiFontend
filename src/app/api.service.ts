import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private url: string = "http://192.168.1.81:8080";

  private signup_url: string = this.url + "/system/signup/"
  private login_url: string = this.url + "/system/login/"
  private profile_url: string = this.url + "/system/profile/"

  private list_url: string = this.url + "/car/allcars/"
  private addcar_url: string = this.url + "/car/addcar/"
  private delete_url: string = this.url + "/car/delete/"
  private viewcar_url: string = this.url + "/car/view/"
  private update_url: string = this.url +"/car/update/"

  Signup(body: any): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.signup_url, body, { observe: 'response' });
  }
  Login(body: any): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.login_url, body, { observe: 'response' })
  }

  name!: string;
  email!: string;
  Profile(headers: HttpHeaders): Observable<any> {
    return this.http.get<HttpResponse<any>>(this.profile_url, { headers, observe: 'response' })
  }

  Lists(headers: HttpHeaders): Observable<any> {
    return this.http.get<HttpResponse<any>>(this.list_url, { headers, observe: 'response' })
  }
  AddCar(body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.addcar_url, body, { headers, observe: 'response' })
  }
  DeleteCar(body: { id: number, url_id: number, user_id: number }, headers: HttpHeaders): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.delete_url, body, { headers, observe: 'response' })
  }
  ViewCar(body: { id: number, url_id: number, user_id: number }, headers: HttpHeaders): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.viewcar_url, body, { headers, observe: 'response' })
  }
  UpdateCar(body:any, headers: HttpHeaders): Observable<any> {
    return this.http.post<HttpResponse<any>>(this.update_url, body, { headers, observe: 'response' })
  }


}
