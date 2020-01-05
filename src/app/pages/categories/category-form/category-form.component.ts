import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

// import toastr from "toastr";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: CategoryModel = new CategoryModel();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
  }

  //PRIVATE METHODS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
        .subscribe(
          (category) => {

            this.category = this.category;
            this.categoryForm.patchValue(category)
          },
          (error) => alert('ocorreu um erro')
        )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = "Cadastro de Nova Categoria: "
    else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory() {
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory(){
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(category: CategoryModel) {
    // toastr.success("Solicitação processada com sucesso");

    //redirect/reload component page
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error) {
    // toastr.error("Ocorreu um error ao processar sua solicitação");
    this.submittingForm = false;

    if (error.status == 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
      else
      this.serverErrorMessages = ["Falha na comunicação com o servidor"]
  }

}
