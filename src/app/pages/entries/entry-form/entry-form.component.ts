import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import toastr from "toastr";


import { switchMap } from "rxjs/operators";
import { EntryModel } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { CategoryModel } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked{
  
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: EntryModel = new EntryModel();
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
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new")
      this.createEntry();
    else // currentAction == "edit"
      this.updateEntry();
  }

  get typeOptions(): Array<any>{
    return Object.entries(EntryModel.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }


  // PRIVATE METHODS

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
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

  private loadEntry() {
    if (this.currentAction == "edit") {
      
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry) // binds loaded entry data to EntryForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private loadCategory(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }


  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = "Cadastro de Novo Lançamento"
    else{
      const entryName = this.entry.name || ""
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
  }


  private createEntry(){
    const entry: EntryModel = EntryModel.fromJson(this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )
  }


  private updateEntry(){
    const entry: EntryModel = EntryModel.fromJson(this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )
  }

  
  private actionsForSuccess(entry: EntryModel){
    toastr.success("Solicitação processada com sucesso!");

    // redirect/reload component page
    this.router.navigateByUrl("entries", {skipLocationChange: true}).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    )
  }


  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
  }
}