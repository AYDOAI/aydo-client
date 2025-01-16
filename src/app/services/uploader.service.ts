import {inject, Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  private readonly httpClient = inject(HttpClient);

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<{url: string; id: string}>(
     `${environment.main_url}/backend/v2/storage/upload`,
      formData,
    )
  }

}
