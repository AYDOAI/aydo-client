import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {
    private readonly httpClient = inject(HttpClient);
    
    requestDisposal() {
        return this.httpClient.delete(`${environment.main_url}/backend/v2/user`)
    }
}
