import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  Signal,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import {
  GridColumnComponent,
  GridOptionsComponent,
  GridViewComponent,
} from '@rauroszm/hermes-ui-kit'
import { DxDropDownButtonModule } from 'devextreme-angular'
import { UiService } from '../../../../../core/services/ui.service'
import { DialogService } from '../../../../../layout/dialog.service'
import { EmptyStateComponent } from '../../../../components/empty-state/empty-state'
import { ModalComponent } from '../../../../components/modal/modal.component'
import { HermesCollectionService } from '../../../../services/hermes-collection.service'
import { HermesDatasourceService } from '../../../../services/hermes-datasource.service'
import { HermesFormComponent } from '../../../hermes-form/components/hermes-form/hermes-form.component'

@Component({
  selector: 'app-hermes-list',
  templateUrl: './hermes-list.component.html',
  styleUrls: ['./hermes-list.component.scss'],
  imports: [
    GridViewComponent,
    GridColumnComponent,
    GridOptionsComponent,
    DxDropDownButtonModule,
    ModalComponent,
    HermesFormComponent,
    EmptyStateComponent,
  ],
})
export class HermesListComponent {
  private ui = inject(UiService)
  private router = inject(Router)
  private ds = inject(HermesDatasourceService)
  private cs = inject(HermesCollectionService)
  private dialog = inject(DialogService)
  private destroyRef = inject(DestroyRef)

  hermesForm: Signal<HermesFormComponent> =
    viewChild.required(HermesFormComponent)

  // Modal state
  isModalOpen = signal(false)
  isLoading = signal(false)
  isFormValid = signal(true)
  isDeleting = signal(false)
  isRefreshing = signal(false)

  // Computed signals
  isAnyActionLoading = computed(
    () => this.isLoading() || this.isDeleting() || this.isRefreshing()
  )

  // Extensibility inputs
  showToolbar = input(true)
  showCreateButton = input(true)
  showRefreshButton = input(true)
  showFilterRow = input(true)
  showExportButton = input(false)
  searchTerm = input('')
  emptyStateConfig = input<{
    icon?: string
    title?: string
    subtitle?: string
    createButtonText?: string
    refreshButtonText?: string
  }>({})

  settings = input.required<{
    title: string
    formProperties?: {
      width?: string
      height?: string
    }
    menu?: {
      value: any
      name: string
      icon: string
      onClick: (e: any) => void
    }[]
    columns?: {
      dataField: string
      caption: string
      dataType: any
      width: number
      template?: TemplateRef<any>
    }[]
    query_list: string
    query_form: string
    query_form_properties?: any
    code?: string
    events?: {
      onSaved?: (e: any) => void
      onPopupClosed?: () => void
      onEdit?: (e: any) => void
      onDelete?: (e: any) => void
      onRefresh?: () => void
    }
    routing?: {
      edit?: string
    }
  }>()
  dataSource = signal<any[]>([])
  filteredData = computed(() => {
    const term = this.searchTerm().trim().toLowerCase()
    if (!term) return this.dataSource()

    return this.dataSource().filter((item: any) => {
      const values = Object.values(item ?? {})
      return values.some((value) => {
        if (value === null || value === undefined) return false
        const str = String(value).toLowerCase()
        return str.includes(term)
      })
    })
  })
  hasData = computed(() => this.filteredData().length > 0)
  id = signal<string | null>(null)

  onSaved = output<any>()
  onDeleted = output<any>()

  constructor() {
    effect(
      () => {
        if (this.settings()?.query_list) {
          this.loadItems(this.settings().query_list)
        }
      },
      { allowSignalWrites: true }
    )
  }

  loadItems = (name: string) => {
    this.isRefreshing.set(true)
    this.ui
      .runWithFeedback(() => this.ds.get(name), '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.dataSource.set(data)
          this.isRefreshing.set(false)
        },
        error: () => {
          this.isRefreshing.set(false)
        },
      })
  }

  openModal = () => {
    this.id.set(null)
    this.isModalOpen.set(true)
  }

  closeModal = () => {
    this.isModalOpen.set(false)
    this.id.set(null)
    this.hermesForm().clearForm()
    this.loadItems(this.settings().query_list)
  }

  onSaveClick = () => {
    const form = this.hermesForm()
    if (!form.isLoading()) {
      this.isLoading.set(true)
      form.onSave()
    }
  }

  onSaveComplete = (success: boolean) => {
    this.isLoading.set(false)
    if (success) {
      this.closeModal()
    }
  }

  onSavedHandler = (e: any) => {
    this.isLoading.set(false)
    this.isModalOpen.set(false)
    this.onSaved.emit(e)
    this.loadItems(this.settings().query_list)
  }

  onPopupClosed = () => {
    this.id.set(null)
    this.hermesForm().clearForm()
  }

  // Public methods for external control
  refresh = () => {
    this.loadItems(this.settings().query_list)
  }

  create = () => {
    this.openModal()
  }

  export = () => {
    // Export functionality will be implemented based on grid component capabilities
    // This can trigger the grid's native export functionality
  }

  itemAction = (e: any, data: any) => {
    const action: number = e.itemData.id

    switch (action) {
      case 1:
        this.handleEdit(data)
        break
      case 2:
        this.handleDelete(data)
        break
    }
  }

  private handleEdit(data: any) {
    this.settings().events?.onEdit?.(data)

    if (this.settings().routing?.edit) {
      this.router.navigate([this.settings().routing?.edit, data.id])
    }
  }

  private handleDelete(data: any) {
    if (this.settings().events?.onDelete) {
      this.settings().events?.onDelete?.(data)
      return
    }

    this.isDeleting.set(true)
    this.ui
      .runWithFeedback(
        () => this.cs.deleteEntity(this.settings().code!, data.id),
        '',
        ''
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isDeleting.set(false)
          this.onDeleted.emit(data)
          this.loadItems(this.settings().query_list)
        },
        error: () => {
          this.isDeleting.set(false)
        },
      })
  }
}
