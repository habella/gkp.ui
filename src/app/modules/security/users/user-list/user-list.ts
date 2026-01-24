import { Component, computed, inject, OnInit, signal } from '@angular/core'
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
import { IRegisterUserRequest, IUser, UserStatus } from '../../models'
import { UserService } from '../../services'

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxLoadIndicatorModule,
    ModalComponent,
    HasRolesDirective,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden p-4',
  },
})
export class UserListComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly userService = inject(UserService)
  private readonly notify = inject(NotifyService)

  // State
  users = signal<IUser[]>([])
  loading = signal(false)
  selectedUser = signal<IUser | null>(null)

  // Create modal
  showCreateModal = signal(false)
  createLoading = signal(false)
  createFormData = signal<IRegisterUserRequest>({
    email: '',
    firstName: '',
    lastName: '',
  })

  // Delete modal
  showDeleteModal = signal(false)
  deleteLoading = signal(false)

  // Activate/Deactivate modal
  showStatusModal = signal(false)
  statusLoading = signal(false)
  statusAction = signal<'activate' | 'deactivate'>('activate')

  // Computed
  statusModalTitle = computed(() =>
    this.statusAction() === 'activate'
      ? 'Activar Usuario'
      : 'Desactivar Usuario',
  )

  statusModalMessage = computed(() => {
    const user = this.selectedUser()
    if (!user) return ''
    return this.statusAction() === 'activate'
      ? `¿Está seguro de activar al usuario "${user.firstName} ${user.lastName}"?`
      : `¿Está seguro de desactivar al usuario "${user.firstName} ${user.lastName}"?`
  })

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.loading.set(true)
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users)
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar usuarios')
        this.loading.set(false)
      },
    })
  }

  onRefresh(): void {
    this.loadUsers()
    this.notify.success('Lista de usuarios actualizada')
  }

  onCreateUser(): void {
    this.createFormData.set({
      email: '',
      firstName: '',
      lastName: '',
    })
    this.showCreateModal.set(true)
  }

  confirmCreate(): void {
    const data = this.createFormData()
    if (!data.email || !data.firstName || !data.lastName) {
      this.notify.error('Por favor complete todos los campos')
      return
    }

    this.createLoading.set(true)
    this.userService.register(data).subscribe({
      next: (user: any) => {
        this.notify.success('Usuario creado correctamente')
        this.closeCreateModal()
        // Robust redirection checking multiple possible ID locations
        const id =
          user?.id ||
          user?.value?.id ||
          (typeof user === 'string' ? user : null)
        if (id) {
          this.router.navigate(['/users', id])
        } else {
          this.loadUsers() // fallback if no ID but created successfully
        }
      },
      error: () => {
        this.notify.error('Error al crear usuario')
        this.createLoading.set(false)
      },
    })
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false)
    this.createLoading.set(false)
  }

  onEditUser(user: IUser): void {
    this.router.navigate(['/users', user.id])
  }

  onViewUser(user: IUser): void {
    this.router.navigate(['/users', user.id])
  }

  // Status change methods
  onActivateUser(user: IUser): void {
    this.selectedUser.set(user)
    this.statusAction.set('activate')
    this.showStatusModal.set(true)
  }

  onDeactivateUser(user: IUser): void {
    this.selectedUser.set(user)
    this.statusAction.set('deactivate')
    this.showStatusModal.set(true)
  }

  confirmStatusChange(): void {
    const user = this.selectedUser()
    if (!user) return

    this.statusLoading.set(true)
    const action$ =
      this.statusAction() === 'activate'
        ? this.userService.activate(user.id)
        : this.userService.inactivate(user.id)

    action$.subscribe({
      next: () => {
        this.notify.success(
          this.statusAction() === 'activate'
            ? 'Usuario activado correctamente'
            : 'Usuario desactivado correctamente',
        )
        this.closeStatusModal()
        this.loadUsers()
      },
      error: () => {
        this.notify.error('Error al cambiar estado del usuario')
        this.statusLoading.set(false)
      },
    })
  }

  closeStatusModal(): void {
    this.showStatusModal.set(false)
    this.statusLoading.set(false)
    this.selectedUser.set(null)
  }

  // Cell templates
  getFullName(data: IUser): string {
    return `${data.firstName} ${data.lastName}`
  }

  getStatusText(status: UserStatus): string {
    switch (status) {
      case UserStatus.Active:
        return 'Activo'
      case UserStatus.Inactive:
        return 'Inactivo'
      case UserStatus.EmailNotConfirmed:
        return 'Email no confirmado'
      case UserStatus.UpdatePassword:
        return 'Actualizar contraseña'
      default:
        return 'Desconocido'
    }
  }

  getStatusClass(status: UserStatus): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
    switch (status) {
      case UserStatus.Active:
        return `${baseClasses} bg-green-100 text-green-800`
      case UserStatus.Inactive:
        return `${baseClasses} bg-red-100 text-red-800`
      case UserStatus.EmailNotConfirmed:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case UserStatus.UpdatePassword:
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }
}
