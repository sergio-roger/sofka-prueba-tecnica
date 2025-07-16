import { Routes } from '@angular/router';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { EditProductsComponent } from './components/edit-products/edit-products.component';

export const ProductsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListProductsComponent,
  },
  {
    path: 'create',
    component: CreateProductsComponent,
  },
  {
    path: 'edit/:id',
    component: EditProductsComponent,
  }
];

export default ProductsRoutes;
