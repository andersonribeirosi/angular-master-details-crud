import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryModel } from '../../categories/shared/category.model';
import { EntryModel } from '../../entries/shared/entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { EntryService } from '../../entries/shared/entry.service';

import currencyformatter from "currency-formatter"


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  ChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: CategoryModel[] = [];
  entries: EntryModel[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private categoryService: CategoryService,
              private entryService: EntryService) { }

  ngOnInit() {
    this.categoryService.getAll()
    .subscribe(categories => this.categories = categories);
  }

  generateReports(){
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year){
      alert('Você precisa escolher um mês e um ano para gerar o relatório')
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
    }
  }

  private setValues(entries: EntryModel[]){
    this.entries = entries;
    this.calculateBalance();
  }

  private calculateBalance(){
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue')
        revenueTotal += currencyformatter.unformat(entry.amount, {code: 'BRL'})
      else {
        expenseTotal += currencyformatter.unformat(entry.amount, {code: 'BRL'})
      }
      });
      this.expenseTotal = currencyformatter.format(expenseTotal, {code: 'BRL'})
      this.revenueTotal = currencyformatter.format(revenueTotal, {code: 'BRL'})
      this.balance = currencyformatter.format(revenueTotal - expenseTotal, {code: 'BRL'});
    }

}
