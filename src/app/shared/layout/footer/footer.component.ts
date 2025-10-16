import {Component, HostListener} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestType} from "../../../../types/request.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  showedForm: boolean = false;
  orderSuccess: boolean = false;
  hasError: boolean = false;

  consultForm = this.fb.group({
    name: ["", Validators.required],
    phone: ["", Validators.required],
    type: 'consultation'
  })

  constructor(private requestService: RequestService,
              private fb: FormBuilder,) {
  }

  toggleShowedForm() {
    this.showedForm = !this.showedForm;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if ((this.showedForm || this.orderSuccess) && (event.target as HTMLElement).className.indexOf('modal-window') === -1) {
      this.showedForm = false;
      this.closeSuccessWindow()
    }
  }

  getConsultation() {
    if (this.consultForm.valid && this.consultForm.value.name && this.consultForm.value.phone) {
      const paramObject: RequestType = {
        name: this.consultForm.value.name,
        phone: this.consultForm.value.phone,
        type: 'consultation'
      }

      this.requestService.getConsultation(paramObject)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            console.log('Возникла ошибка при отправке данных')
            this.hasError = true
          } else {
            console.log('Данные успешно отправлены');
            this.orderSuccess = true
            this.hasError = false
          }
        })
    }
  }

  closeSuccessWindow() {
    this.orderSuccess = false
    this.consultForm.reset()
  }
}
