import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from "@angular/forms";


import { EntryModel } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { CategoryModel } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form-component';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<EntryModel> implements OnInit {

  categories: Array<CategoryModel>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };


  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new EntryModel(), entryService, EntryModel.fromJson);
  }

  ngOnInit() {
    this.loadCategory();
    super.ngOnInit();
  }

  get typeOptions(): Array<any> {
    return Object.entries(EntryModel.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadCategory() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  protected creationPageTitle(): string{
    return "Cadastro de um novo Lançamento"
  }

  protected editionPageTitle(): string{
    const entryName = this.resource.name || "";
    return "Editando Lançamento: " + entryName;
  }

}