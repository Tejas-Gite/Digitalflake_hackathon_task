import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private router: Router) { }


  limit(val: any) {
    let currentURL = window.location.pathname
    this.router.navigate([currentURL], { queryParams: { pages: 1, limit: val.value }, queryParamsHandling: 'merge' });
    let limit = val.value
    return limit
  }

  first()
  {
    let currentURL = window.location.pathname
    this.router.navigate([currentURL], { queryParams: { pages: 1 }, queryParamsHandling: 'merge' });
    return 1
  }
  
  last(lastPage:any)
  {
    let currentURL = window.location.pathname
    this.router.navigate([currentURL], { queryParams: { pages:lastPage }, queryParamsHandling: 'merge' });
    return lastPage
  }


  next(pg: any) {
    let currentURL = window.location.pathname
    this.router.navigate([currentURL], { queryParams: { pages: pg + 1 }, queryParamsHandling: 'merge' });
    return pg + 1;
  }

  back(pg: any) {
    let currentURL = window.location.pathname;
    this.router.navigate([currentURL], { queryParams: { pages: pg - 1 }, queryParamsHandling: 'merge' });
    return pg - 1;
  }

  serialNumber(limit: number, pages: number) {
    return limit * (pages - 1) + 1;
  }

  search(val:any)
  {
    let currentURL = window.location.pathname;
    this.router.navigate([currentURL], { queryParams: { search: val, pages: 1}, queryParamsHandling: 'merge' });
  }
}
