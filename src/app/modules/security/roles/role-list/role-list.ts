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
import { ICreateRoleRequest, IRole } from '../../models'
import { RoleService } from '../../services'

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxLoadIndicatorModule,
    ModalComponent,
    HasRolesDirective,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden p-4',
  },
})
export class RoleListComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly roleService = inject(RoleService)
  private readonly notify = inject(NotifyService)

  // State
  roles = signal<IRole[]>([])
  loading = signal(false)
  selectedRole = signal<IRole | null>(null)

  // Create modal
  showCreateModal = signal(false)
  createLoading = signal(false)
  createFormData = signal<ICreateRoleRequest>({
    name: '',
  })

  // Delete modal
  showDeleteModal = signal(false)
  deleteLoading = signal(false)

  ngOnInit(): void {
    this.loadRoles()
  }

  loadRoles(): void {
    this.loading.set(true)
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles.set(roles)
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar roles')
        this.loading.set(false)
      },
    })
  }

  onRefresh(): void {
    this.loadRoles()
    this.notify.success('Lista de roles actualizada')
  }

  onCreateRole(): void {
    this.createFormData.set({ name: '' })
    this.showCreateModal.set(true)
  }

  confirmCreate(): void {
    const data = this.createFormData()
    if (!data.name) {
      this.notify.error('El nombre es requerido')
      return
    }

    this.createLoading.set(true)
    this.roleService.create(data).subscribe({
      next: (role: any) => {
        this.notify.success('Rol creado correctamente')
        this.closeCreateModal()
        // Robust redirection
        const id =
          role?.id ||
          role?.value?.id ||
          (typeof role === 'string' ? role : null)
        if (id) {
          this.router.navigate(['/roles', id])
        } else {
          this.loadRoles()
        }
      },
      error: () => {
        this.notify.error('Error al crear rol')
        this.createLoading.set(false)
      },
    })
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false)
    this.createLoading.set(false)
  }

  onEditRole(role: IRole): void {
    this.router.navigate(['/roles', role.id])
  }

  onDeleteRole(role: IRole): void {
    this.selectedRole.set(role)
    this.showDeleteModal.set(true)
  }

  confirmDelete(): void {
    const role = this.selectedRole()
    if (!role) return

    this.deleteLoading.set(true)
    this.roleService.delete(role.id).subscribe({
      next: () => {
        this.notify.success('Rol eliminado correctamente')
        this.closeDeleteModal()
        this.loadRoles()
      },
      error: () => {
        this.notify.error('Error al eliminar rol')
        this.deleteLoading.set(false)
      },
    })
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false)
    this.deleteLoading.set(false)
    this.selectedRole.set(null)
  }
}
