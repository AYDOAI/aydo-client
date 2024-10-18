import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BaseElement} from '../base.component';
import { FormGroup } from '@angular/forms';
import { SelectItem } from "../../shared/types";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
  ]
})
export class SelectComponent extends BaseElement {

  @Input() class: string = '';
  @Input() form!: FormGroup;
  @Input() key: string = '';
  @Input() title: string = '';
  @Input() items: SelectItem[] = [];
  @Input() height: string = '';
  @Input() color: string = '';
  @Input() background: string = '';
  @Input() error: any;
  @Input() func: any;
  @Input() hide_clear: boolean = false;
  @Output() onSelect: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('input') input!: ElementRef;
  expanded = false;
  findValue = '';

  value: string | number = '';

  get valueEx(): string | number {
    return this.form ? this.form.get(this.key)?.value : (this.func ? this.func.value : this.value);
  }

  get itemsEx(): any[] {
    if (Array.isArray(this.items)) {
      return this.items;
    } else {
      const result: any[] = [];
      Object.keys(this.items).forEach((key) => {
        // @ts-ignore
        result.push(this.items[key]);
      });
      return result;
    }
  }

  onInit() {
  }

  select(item: SelectItem) {
    if (this.form) {
      this.form.get(this.key)?.setValue(item ? item.id : null);
    }
    if (item && item.id === undefined) {
      item.id = item.title!;
    }
    this.expanded = false;
    this.onSelect.emit(item);
  }

  clear(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    this.select({ id: '' });
  }

  find(ev: Event) {
    ev.stopPropagation();
    setTimeout(() => {
      this.input.nativeElement.focus();
    })
  }

  skip(ev: Event) {
    ev.stopPropagation();
  }

  isActive(item: SelectItem) {
    return this.form ? this.form.get(this.key)?.value === item.id : (this.func ? this.func.value === item.id : false)
  }

  selectActive() {
    if (Array.isArray(this.items)) {
      return this.items.find(item => item.id === this.valueEx);
    } else {
      return this.items[this.valueEx];
    }
  }

  selectActiveTitle() {
    const item = this.selectActive();
    return item ? item.title : '';
  }

  selectActiveIcon(): string {
    const item = this.selectActive();
    return item && item.icon ? item.icon : '';
  }

  expand() {
    this.expanded = !this.expanded;
    setTimeout(() => {
      const item = this.selectActive();
      if (this.items && this.items.length > 20 && item) {
        // @ts-ignore
        const el = document.getElementById(item.id);
        // this.ui.scroll({y: el.offsetTop - 108});
      } else {
        // this.ui.scroll({y: element.offsetTop - 44});
      }
    });
  }

  isSelected(item: SelectItem) {
    const active = this.selectActive();
    return active && active.id === item.id;
  }

  getId(item: SelectItem) {
    return !item.icon ? item.id : '';
  }

  findChange(e: Event) {

  }

}
