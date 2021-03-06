import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { CategoryModel } from '../shared/category.model';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  private categories: CategoryModel[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Lista retornada com sucesso')
    )
  }

  delete(category) {
    const mustDelete = confirm("Deseja realmente deletar este item?")

    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category)
      )
    }
  }

}
