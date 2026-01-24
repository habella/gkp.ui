import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  DxButtonModule,
  DxFormModule,
  DxLoadIndicatorModule,
  DxTemplateModule,
  DxTextAreaModule,
  DxTextBoxModule,
} from 'devextreme-angular'
import { HasRolesDirective } from '../../../../core/directives/hasRoles.directive'
import { NotifyService } from '../../../../core/services/notify.service'
import {
  ICreatePermissionRequest,
  IPermission,
  IUpdatePermissionRequest,
} from '../../models'
import { PermissionService } from '../../services'

@Component({
  selector: 'app-permission-detail',
  standalone: true,
  imports: [
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxTemplateModule,
    HasRolesDirective,
  ],
  templateUrl: './permission-detail.html',
  styleUrl: './permission-detail.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden p-4',
  },
})
export class PermissionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly permissionService = inject(PermissionService)
  private readonly notify = inject(NotifyService)

  // State
  permissionId = signal<string | null>(null)
  isNew = computed(() => this.permissionId() === 'new' || !this.permissionId())
  loading = signal(false)
  saving = signal(false)

  // Permission data
  permission = signal<IPermission>({
    id: '',
    name: '',
    description: '',
    group: '',
    subGroup: null,
  })

  // Form data
  formData = signal<ICreatePermissionRequest>({
    name: '',
    description: '',
    group: '',
    subGroup: null,
  })

  // Page title
  pageTitle = computed(() =>
    this.isNew() ? 'Nuevo Permiso' : 'Editar Permiso',
  )

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.permissionId.set(id)

    if (!this.isNew()) {
      this.loadPermission()
    }
  }

  loadPermission(): void {
    const id = this.permissionId()
    if (!id) return

    this.loading.set(true)
    this.permissionService.getById(id).subscribe({
      next: (permission) => {
        this.permission.set(permission)
        this.formData.set({
          name: permission.name,
          description: permission.description,
          group: permission.group,
          subGroup: permission.subGroup,
        })
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar el permiso')
        this.loading.set(false)
        this.router.navigate(['/permissions'])
      },
    })
  }

  onSave(): void {
    if (this.isNew()) {
      this.createPermission()
    } else {
      this.updatePermission()
    }
  }

  createPermission(): void {
    this.saving.set(true)
    this.permissionService.create(this.formData()).subscribe({
      next: (permission) => {
        this.notify.success('Permiso creado correctamente')
        this.saving.set(false)
        this.router.navigate(['/permissions', permission.id])
      },
      error: () => {
        this.notify.error('Error al crear permiso')
        this.saving.set(false)
      },
    })
  }

  updatePermission(): void {
    const id = this.permissionId()
    if (!id) return

    this.saving.set(true)
    const updateData: IUpdatePermissionRequest = {
      id: id,
      ...this.formData(),
    }

    this.permissionService.update(updateData).subscribe({
      next: () => {
        this.notify.success('Permiso actualizado correctamente')
        this.saving.set(false)
        this.loadPermission()
      },
      error: () => {
        this.notify.error('Error al actualizar permiso')
        this.saving.set(false)
      },
    })
  }

  onCancel(): void {
    this.router.navigate(['/permissions'])
  }

  updateFormField(
    field: keyof ICreatePermissionRequest,
    value: string | null,
  ): void {
    this.formData.update((data) => ({ ...data, [field]: value }))
  }
}
