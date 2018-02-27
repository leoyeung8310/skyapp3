export class CommonService {

  constructor() {
  }

  public localStorageItem(id: string): string {
    return localStorage.getItem(id);
  }

  public onLoggedout() {
    localStorage.removeItem('isLoggedin');
  }
}
