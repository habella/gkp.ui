import { Component, inject, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular'
import { HasRolesDirective } from '../../../../core/directives/hasRoles.directive'
import { NotifyService } from '../../../../core/services/notify.service'
import { ModalComponent } from '../../../../shared/components/modal/modal.component'
import { ICreatePermissionRequest, IPermission } from '../../models'
import { PermissionService } from '../../services'

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxLoadIndicatorModule,
    ModalComponent,
    HasRolesDirective,
  ],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden p-4',
  },
})
export class PermissionListComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly permissionService = inject(PermissionService)
  private readonly notify = inject(NotifyService)

  // State
  permissions = signal<IPermission[]>([])
  loading = signal(false)
  selectedPermission = signal<IPermission | null>(null)

  // Create modal
  showCreateModal = signal(false)
  createLoading = signal(false)
  createFormData = signal<ICreatePermissionRequest>({
    name: '',
    description: '',
    group: '',
    subGroup: null,
  })

  // Delete modal
  showDeleteModal = signal(false)
  deleteLoading = signal(false)

  ngOnInit(): void {
    this.loadPermissions()
  }

  loadPermissions(): void {
    this.loading.set(true)
    this.permissionService.getAll().subscribe({
      next: (permissions) => {
        this.permissions.set(permissions)
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar permisos')
        this.loading.set(false)
      },
    })
  }

  onRefresh(): void {
    this.loadPermissions()
    this.notify.success('Lista de permisos actualizada')
  }

  onCreatePermission(): void {
    this.createFormData.set({
      name: '',
      description: '',
      group: '',
      subGroup: null,
    })
    this.showCreateModal.set(true)
  }

  confirmCreate(): void {
    const data = this.createFormData()
    if (!data.name || !data.group || !data.description) {
      this.notify.error('Por favor complete los campos requeridos')
      return
    }

    this.createLoading.set(true)
    this.permissionService.create(data).subscribe({
      next: (permission: any) => {
        this.notify.success('Permiso creado correctamente')
        this.closeCreateModal()
        // Robust redirection
        const id =
          permission?.id ||
          permission?.value?.id ||
          (typeof permission === 'string' ? permission : null)
        if (id) {
          this.router.navigate(['/permissions', id])
        } else {
          this.loadPermissions()
        }
      },
      error: () => {
        this.notify.error('Error al crear permiso')
        this.createLoading.set(false)
      },
    })
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false)
    this.createLoading.set(false)
  }

  onEditPermission(permission: IPermission): void {
    this.router.navigate(['/permissions', permission.id])
  }

  onDeletePermission(permission: IPermission): void {
    this.selectedPermission.set(permission)
    this.showDeleteModal.set(true)
  }

  confirmDelete(): void {
    const permission = this.selectedPermission()
    if (!permission) return

    this.deleteLoading.set(true)
    this.permissionService.delete(permission.id).subscribe({
      next: () => {
        this.notify.success('Permiso eliminado correctamente')
        this.closeDeleteModal()
        this.loadPermissions()
      },
      error: () => {
        this.notify.error('Error al eliminar permiso')
        this.deleteLoading.set(false)
      },
    })
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false)
    this.deleteLoading.set(false)
    this.selectedPermission.set(null)
  }
}
