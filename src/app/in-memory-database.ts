import { InMemoryDbService } from "angular-in-memory-web-api";
import { CategoryModel } from './pages/categories/shared/category.model';
import { EntryModel } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: CategoryModel[] = [
            { id: 1, name: 'Corte', description: 'Corte de Cabelo Masculino' },
            { id: 2, name: 'Corte + Barba', description: 'Corte de Cabelo + Barba' },
            { id: 3, name: 'Tratamento Facial', description: 'Tratamento Facial(esfoliação), etc' },
            { id: 4, name: 'Oleo para Barba', description: 'Óleo para barba' },
            { id: 5, name: 'Gel para barba', description: 'Gel para Barba' },
            
           
        ];

        const entries: EntryModel[] = [
            { id: 1, name: 'Anderson Ribeiro', categoryId: categories[0].id, category: categories[0], paid: true, date: "14/01/2020", amount: "70,80", type: "revenue", description: "Corte de Cabelo + Barba"} as EntryModel,
            { id: 2, name: 'Suplementos', categoryId: categories[1].id, category: categories[1], paid: false, date: "14/01/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 3, name: 'Salário na Empresa X', categoryId: categories[3].id, category: categories[3], paid: true, date: "15/01/2020", amount: "4405,49", type: "revenue" } as EntryModel,
            { id: 4, name: 'Aluguel de Filme', categoryId: categories[2].id, category: categories[2], paid: true, date: "16/02/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 5, name: 'Suplementos', categoryId: categories[1].id, category: categories[1], paid: true, date: "17/02/2020", amount: "30,00", type: "expense" } as EntryModel,
            { id: 6, name: 'Video Game da Filha', categoryId: categories[2].id, category: categories[2], paid: false, date: "17/02/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 11, name: 'Uber', categoryId: categories[1].id, category: categories[1], paid: true, date: "17/03/2020", amount: "30,00", type: "expense" } as EntryModel,
            { id: 12, name: 'Aluguel', categoryId: categories[2].id, category: categories[2], paid: false, date: "23/03/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 13, name: 'Gás de Cozinha', categoryId: categories[1].id, category: categories[1], paid: false, date: "25/04/2020", amount: "30,00", type: "expense" } as EntryModel,
            { id: 14, name: 'Pagamento Pelo Projeto XYZ', categoryId: categories[4].id, category: categories[4], paid: true, date: "25/04/2020", amount: "2980,00", type: "revenue" } as EntryModel,
            { id: 19, name: 'Aluguel de Filme', categoryId: categories[2].id, category: categories[2], paid: false, date: "07/05/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 21, name: 'Video Game da Filha', categoryId: categories[1].id, category: categories[1], paid: true, date: "17/05/2020", amount: "30,00", type: "expense" } as EntryModel,
            { id: 22, name: 'Cinema', categoryId: categories[2].id, category: categories[2], paid: true, date: "18/06/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 23, name: 'Jiu Jitsu', categoryId: categories[1].id, category: categories[1], paid: false, date: "21/06/2020", amount: "130,00", type: "expense" } as EntryModel,
            { id: 44, name: 'Uber', categoryId: categories[2].id, category: categories[2], paid: true, date: "28/07/2020", amount: "15,00", type: "expense" } as EntryModel,
            { id: 55, name: 'Cinema', categoryId: categories[1].id, category: categories[1], paid: false, date: "28/07/2020", amount: "30,00", type: "expense" }  as EntryModel
          ]

        return { categories, entries }
    }
}

