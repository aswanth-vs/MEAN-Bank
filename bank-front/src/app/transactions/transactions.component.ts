import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  ngOnInit() {
    if (!localStorage.getItem('token')) {
      alert('Please Login');
      this.transRouter.navigateByUrl('');
    }
    this.currentAC = localStorage.getItem('currentAcno') || '';
    this.api.getTransactions().subscribe(
      (result: any) => {
        console.log(result);
        this.transactions = result.transactions;
        //need to update transaction logic to only get the other account.
        //as of now need to use both toAcno and fromAcno. Otherwise if only toAcno is used then credit transaction will not be complete.
      },
      (error) => {
        console.log(error.error);
      }
    );
  }
  constructor(private api: ApiService, private transRouter: Router) {}
  transactions: any = [];
  searchKey: string = '';
  currentAC: string = '';

  //to generate PDF
  generatePDF() {
    //creating an object for jspdf
    var pdf = new jspdf();
    //setting title row for the table
    let tHead = ['Type', 'From Account', 'To Account', 'Amount'];
    let tBody = [];
    //setting up pdf properties
    pdf.setFontSize(16);
    pdf.setTextColor('red');
    pdf.text('Mini Statement A/C ' + this.currentAC, 15, 10);
    pdf.setFontSize(12);

    //ro display as a table need to convert array of objects to nested array
    for (let item of this.transactions) {
      let temp = [item.type, item.fromAcno, item.toAcno, item.amount];
      tBody.push(temp);
    }
    //convert nested array into table using autotable
    (pdf as any).autoTable(tHead, tBody, { startY: 15 });
    //open pdf in another window
    pdf.output('dataurlnewwindow');
    //to save/download pdf
    pdf.save('Mini_Statement.pdf');
  }
}
