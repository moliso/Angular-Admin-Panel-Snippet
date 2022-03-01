import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsCategoriesService } from 'src/app/customizables/nested/meals-categories/meals-categories.service';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { ProductWriteDto } from 'src/app/models/product.write.model';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css']
})
export class ModifyProductComponent implements OnInit {
  product!: ProductWriteDto
  categories!: Category[];

  productForm = this.formBuilder.group({
    id: [this.route.snapshot.params['id']],
    name: ['', Validators.required],
    category: ['', Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private categoryService: MealsCategoriesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getProductData(this.route.snapshot.params['id']);
    this.retrieveCategories();
  }

  filter(value: any) {
    value = value.replace(",", ".")
  }

  retrieveCategories(): void {
    this.categoryService.getAll()
      .subscribe(categories => {
        this.categories = categories;
      },
      error => {
        console.log(error);
      })
  }

  getProductData(id: any) {
    this.productService.get(id).subscribe(product => {
      this.product = product;
      this.initProductForm();
    },
      error => {
        console.log(error);
      })
  }

  initProductForm(): void {
    this.productForm = this.formBuilder.group({
      id: [this.route.snapshot.params['id']],
      name: this.product.name,
      category: this.product.category,
    })
  }

  updateProduct(id: any, product: any) {
    this.productService.update(id, this.productForm.value).subscribe(data => {
      this.product = product;
      console.log(data);
    },
      error => {
        console.log(error);
      })
  }
}
