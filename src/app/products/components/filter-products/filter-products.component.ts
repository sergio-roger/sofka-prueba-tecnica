import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { FilterProductsForm } from './filter-products.form';

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './filter-products.component.html',
  styleUrl: './filter-products.component.scss',
})
export class FilterProductsComponent extends FilterProductsForm implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private queryParamMap$ = this.route.queryParamMap;

  ngOnInit(): void {
    this.subs.add(this.queryParamMap$.subscribe(this.queryParamMap));
  }

  private queryParamMap = (queryParamMap: ParamMap): void => {
    const searchText =  queryParamMap.get('search');

    if (!queryParamMap.has('search')) {
      this.search.reset();
      return;
    }

    this.search.setValue(searchText);
  };

  public onSearch(): void {
    const searchValue = this.search.value?.trim();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: searchValue?.length ? searchValue : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
