import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
  viewChild,
} from '@angular/core'
import {
  CheckBox,
  DateBox,
  DfComponent,
  HeaderBox,
  NumberBox,
  RadioGroup,
  RichText,
  SelectBox,
  TextArea,
  TextBox,
} from '@rauroszm/hermes-ui-kit'
import { AngularSvgIconModule } from 'angular-svg-icon'
import { forkJoin, Observable, of, switchMap } from 'rxjs'
import { NotifyService } from '../../../../../core/services/notify.service'
import { UiService } from '../../../../../core/services/ui.service'
import { dateFormat } from '../../../../../core/utils'
import { HermesFormService } from '../../hermes-form.service'

@Component({
  selector: 'hermes-form',
  standalone: true,
  templateUrl: './hermes-form.component.html',
  styleUrls: ['./hermes-form.component.css'],
  imports: [DfComponent, AngularSvgIconModule],
})
export class HermesFormComponent implements OnInit {
  fromS = inject(HermesFormService)
  formState = inject(HermesFormService)
  ui = inject(UiService)
  private form: Signal<DfComponent> = viewChild.required(DfComponent)

  code = input.required<string>()
  id = input<any>()
  properties = input<any>()
  extraSaveActions = input<any[]>([]) // Observables to execute continuously
  notifyS = inject(NotifyService)

  onSaved = output<any>()
  onSavedComplete = output<boolean>()

  data = signal<any>({})
  formItems = signal<any[]>([])

  #collection_code = signal<string>('')

  isLoading = signal(false)
  isSussess = signal(false)
  isError = signal(false)

  constructor() {
    effect(() => {
      let code = this.code()
      let id = this.id()

      this.#loadItems(code, id)
    })
  }

  clearForm() {
    this.data.set({})
  }

  ngOnInit() {}

  onSave = () => {
    this.form().validate()
    if (this.form().validation.isValid === false) {
      return
    }
    let dataSave = { ...this.data() }

    if (this.properties()) {
      dataSave = {
        ...this.properties(),
        ...dataSave,
      }
    }

    this.formItems()
      .filter((m) => m.type == 'date')
      .forEach((field: any) => {
        if (field.id && dataSave[field.id]) {
          dataSave[field.id] = dateFormat(dataSave[field.id])
        }
      })

    let save = this.id()
      ? this.fromS.update(this.#collection_code(), this.id(), dataSave)
      : this.fromS.create(this.#collection_code(), dataSave)

    const extra: Observable<any>[] = this.extraSaveActions().map(
      (action: any) => (typeof action === 'function' ? action() : action)
    )

    const actions: Observable<any>[] = [save, ...extra]

    this.ui
      .runWithFeedback(
        () => forkJoin(actions),
        'Formulario guardado correctamente',
        'Error al guardar el formulario'
      )
      .subscribe({
        next: (res: any) => {
          this.onSaved.emit({
            id: res,
            data: this.data(),
          })
          this.onSavedComplete.emit(true)
        },
        error: (err: any) => {
          this.onSaved.emit({
            data: this.data(),
          })
          console.log(err)
          this.onSavedComplete.emit(false)
        },
      })
  }

  #loadItems = (code: string, id: string | null) => {
    this.isLoading.set(true)
    this.isSussess.set(false)
    this.isError.set(false)

    this.fromS
      .get(code)
      .pipe(
        switchMap((res: any) => {
          if (res) {
            this.#collection_code.set(res.collection_code)
            this.#setFields(res.fields)

            if (id !== null) {
              return this.fromS.getEntity(this.#collection_code(), id)
            } else {
              return of(null)
            }
          } else return of(null)
        })
      )
      .subscribe({
        next: (entityRes: any) => {
          if (entityRes) {
            this.data.set(entityRes)
          } else {
            this.data.set({})
          }

          this.isSussess.set(true)
          this.isLoading.set(false)
          this.isError.set(false)
        },
        error: (err: any) => {
          this.isError.set(true)
          this.isLoading.set(false)
          this.isSussess.set(false)

          this.notifyS.error('Error al cargar el formulario')
        },
      })
  }

  #setFields = (items: any[]) => {
    let fields: any[] = []

    items.forEach((field: any) => {
      let fieldItem: any = {
        id: field.propertyName,
        title: field.title,
        required: field.isRequired,
        row: field.row,
        column: field.column,
        width: field.width,
        readonly: field.isReadOnly,
      }

      switch (field.propertyType) {
        case 'textbox':
          fields.push(new TextBox(fieldItem))
          break
        case 'textarea':
          fields.push(new TextArea(fieldItem))
          break
        case 'radio':
          fields.push(
            new RadioGroup({
              ...fieldItem,
              orientation: 'vertical',
            })
          )
          break
        case 'header':
          fields.push(new HeaderBox(fieldItem))
          break
        case 'numeric':
          fields.push(
            new NumberBox({
              ...fieldItem,
              format: '#,##0.####',
              step: 0.1,
            })
          )
          break
        case 'integer':
          fields.push(
            new NumberBox({
              ...fieldItem,
            })
          )
          break
        case 'richtext':
          fields.push(new RichText(fieldItem))
          break
        case 'label':
          fields.push(new HeaderBox(fieldItem))
          break
        case 'checkbox':
          fields.push(new CheckBox(fieldItem))
          break
        case 'datetime':
          fields.push(
            new DateBox({
              ...fieldItem,
              displayFormat: 'dd/MM/yyyy HH:mm',
            })
          )
          break
        case 'select':
          fieldItem['options'] = signal(field.options)
          fields.push(new SelectBox(fieldItem))
          break
        default:
          // fieldItem['type'] = 'text';
          break
      }
    })

    this.formItems.set(fields)
  }
}
