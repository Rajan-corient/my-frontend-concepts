import {Component, EventEmitter, OnInit, Output, SecurityContext} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SecurityService, UserRole } from '../security.service';

@Component({
  selector: 'my-frontend-concepts-nomination',
  templateUrl: './nomination.component.html',
  styleUrls: ['./nomination.component.scss']
})
export class NominationComponent implements OnInit {

  @Output() stepChanged: EventEmitter<number> = new EventEmitter();
  fg!: FormGroup;
  step = 1;
  
  constructor(private securityContext: SecurityService) {
  }

  ngOnInit() {
    this.fg = new FormGroup({
      step1: new FormControl(),
      step2: new FormControl(),
    });
  }

  handleNext() {
    this.step = 2;
    const nomHeader = this.fg.get('step1')?.value.nominationHeader;
    this.fg.get('step2')?.patchValue({
      nominationHeader: nomHeader,
      ledger: null,
    });
    this.stepChanged.emit(2);
    console.log('main form group', this.fg);
  }
  handlePrevious() {
    this.step = 1;
    this.stepChanged.emit(1);
  }

  changeSecurityContext(data: { role: any; }) {
    this.changeSecurityContext({
      role: data,
    });
  }

}
