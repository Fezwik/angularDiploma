import {Component, HostListener, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestService} from "../../shared/services/request.service";
import {RequestType} from "../../../types/request.type";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  mainOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  }

  feedbackOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false,
    margin: 25
  }

  showedForm: boolean = false;
  orderSuccess: boolean = false;
  hasError: boolean = false;
  topArticles: ArticleType[] = []

  constructor(private fb: FormBuilder,
              private articleService: ArticleService,
              private requestService: RequestService) {
  }

  orderForm = this.fb.group({
    service: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
    type: 'order'
  })

  ngOnInit(): void {
    this.articleService.getTopArticles()
      .subscribe((data: ArticleType[]) => {
        if (data) {
          this.topArticles = data
        }
      })
  }

  showModal(service: string) {
    this.showedForm = true;
    this.orderForm.get('service')?.setValue(service);
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if ((this.showedForm || this.orderSuccess) && (event.target as HTMLElement).className.indexOf('modal-window') === -1) {
      this.showedForm = false;
      this.closeSuccessWindow()
    }
  }

  getConsultation() {
    this.orderForm.value.type = 'order'
    if (this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone
      && this.orderForm.value.type && this.orderForm.value.service) {
      const paramObject: RequestType = {
        type: this.orderForm.value.type,
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        service: 'order'
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
    this.orderForm.reset()
  }
}
