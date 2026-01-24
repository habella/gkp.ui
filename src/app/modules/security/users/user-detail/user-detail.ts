import { CommonModule, DatePipe } from '@angular/common'
import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxLoadIndicatorModule,
  DxSelectBoxModule,
  DxTemplateModule,
} from 'devextreme-angular'
import { HasRolesDirective } from '../../../../core/directives/hasRoles.directive'
import { NotifyService } from '../../../../core/services/notify.service'
import { ModalComponent } from '../../../../shared/components/modal/modal.component'
import { TabComponent, TabsComponent } from '../../../../shared/components/tabs'
import {
  IRegisterUserRequest,
  IUser,
  IUserRoleRelation,
  UserStatus,
} from '../../models'
import { IRole } from '../../models/role.model'
import {
  RoleService,
  UserRoleRelationService,
  UserService,
} from '../../services'

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTemplateModule,
    TabsComponent,
    TabComponent,
    ModalComponent,
    HasRolesDirective,
    DatePipe,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden bg-slate-50',
  },
})
export class UserDetailComponent implements OnInit {
  @Input() set id(val: string) {
    this.userId.set(val)
    if (val && val !== 'new') {
      this.loadUser()
      this.loadUserRoles()
    }
  }

  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly userService = inject(UserService)
  private readonly userRoleService = inject(UserRoleRelationService)
  private readonly roleService = inject(RoleService)
  private readonly notify = inject(NotifyService)

  // State
  userId = signal<string | null>(null)
  isNew = computed(() => this.userId() === 'new' || !this.userId())
  loading = signal(false)
  saving = signal(false)
  activeTab = signal<number | string>('info')

  // User data
  user = signal<IUser>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    status: UserStatus.Active,
    isActive: true,
  })

  // Form data for new user
  formData = signal<IRegisterUserRequest>({
    email: '',
    firstName: '',
    lastName: '',
  })

  // Roles management
  userRoles = signal<IUserRoleRelation[]>([])
  availableRoles = signal<IRole[]>([])
  rolesLoading = signal(false)

  private _selectedRoleId: string | null = null
  get selectedId(): string | null {
    return this._selectedRoleId
  }
  set selectedId(val: string | null) {
    this._selectedRoleId = val
  }

  // Add role modal
  showAddRoleModal = signal(false)
  addRoleLoading = signal(false)

  // Remove role modal
  showRemoveRoleModal = signal(false)
  removeRoleLoading = signal(false)
  selectedUserRole = signal<IUserRoleRelation | null>(null)

  // Page title
  pageTitle = computed(() =>
    this.isNew() ? 'Nuevo Usuario' : 'Editar Usuario',
  )

  // Computed: roles available to add (not already assigned)
  rolesForSelect = computed(() => {
    const assigned = this.userRoles().map((ur) => ur.roleId)
    return this.availableRoles().filter((r) => !assigned.includes(r.id))
  })

  ngOnInit(): void {
    this.loadAvailableRoles()
  }

  loadUser(): void {
    const id = this.userId()
    if (!id) return

    this.loading.set(true)
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user.set(user)
        this.formData.set({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar el usuario')
        this.loading.set(false)
        this.router.navigate(['/users'])
      },
    })
  }

  loadUserRoles(): void {
    const id = this.userId()
    if (!id) return

    this.rolesLoading.set(true)
    this.userRoleService.getByUserId(id).subscribe({
      next: (roles) => {
        this.userRoles.set(roles)
        this.rolesLoading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar roles del usuario')
        this.rolesLoading.set(false)
      },
    })
  }

  onRefreshRoles(): void {
    this.loadUserRoles()
    this.notify.success('Lista de roles actualizada')
  }

  loadAvailableRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles) => this.availableRoles.set(roles),
      error: () => this.notify.error('Error al cargar roles disponibles'),
    })
  }

  onSave(): void {
    if (this.isNew()) {
      this.createUser()
    }
    // Note: Update is not available in the API, only register
  }

  createUser(): void {
    this.saving.set(true)
    this.userService.register(this.formData()).subscribe({
      next: (user) => {
        this.notify.success('Usuario creado correctamente')
        this.saving.set(false)
        this.router.navigate(['/users', user.id])
      },
      error: () => {
        this.notify.error('Error al crear usuario')
        this.saving.set(false)
      },
    })
  }

  onCancel(): void {
    this.router.navigate(['/users'])
  }

  onToggleStatus(): void {
    const userId = this.userId()
    if (!userId || userId === 'new') return

    const isActive = this.user().status === UserStatus.Active
    const action = isActive
      ? this.userService.inactivate(userId)
      : this.userService.activate(userId)

    this.loading.set(true)
    action.subscribe({
      next: () => {
        this.notify.success(
          `Usuario ${isActive ? 'desactivado' : 'activado'} correctamente`,
        )
        this.loadUser()
      },
      error: () => {
        this.notify.error('Error al cambiar el estado del usuario')
        this.loading.set(false)
      },
    })
  }

  // Roles management
  onAddRole(): void {
    this.selectedId = null
    this.showAddRoleModal.set(true)
  }

  confirmAddRole(): void {
    const roleId = this.selectedId
    const userId = this.userId()
    if (!roleId || !userId) return

    this.addRoleLoading.set(true)
    this.userRoleService.create({ userId, roleId }).subscribe({
      next: () => {
        this.notify.success('Rol asignado correctamente')
        this.closeAddRoleModal()
        this.loadUserRoles()
      },
      error: () => {
        this.notify.error('Error al asignar rol')
        this.addRoleLoading.set(false)
      },
    })
  }

  closeAddRoleModal(): void {
    this.showAddRoleModal.set(false)
    this.addRoleLoading.set(false)
    this.selectedId = null
  }

  onRemoveRole(userRole: IUserRoleRelation): void {
    this.selectedUserRole.set(userRole)
    this.showRemoveRoleModal.set(true)
  }

  confirmRemoveRole(): void {
    const userRole = this.selectedUserRole()
    if (!userRole) return

    this.removeRoleLoading.set(true)
    this.userRoleService.delete(userRole.id).subscribe({
      next: () => {
        this.notify.success('Rol removido correctamente')
        this.closeRemoveRoleModal()
        this.loadUserRoles()
      },
      error: () => {
        this.notify.error('Error al remover rol')
        this.removeRoleLoading.set(false)
      },
    })
  }

  closeRemoveRoleModal(): void {
    this.showRemoveRoleModal.set(false)
    this.removeRoleLoading.set(false)
    this.selectedUserRole.set(null)
  }

  // Form field update
  updateFormField(field: keyof IRegisterUserRequest, value: string): void {
    this.formData.update((data) => ({ ...data, [field]: value }))
  }

  getRoleName(data: any): string {
    if (!data) return ''
    const roleId = typeof data === 'string' ? data : data.roleId

    // Si viene el objeto completo de rol (por ejemplo desde el backend)
    if (data.role?.name) return data.role.name

    // Si no, lo buscamos en la lista global
    const role = this.availableRoles().find((r) => r.id === roleId)
    return role?.name || roleId
  }

  copyToClipboard(text: string): void {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      this.notify.success('Copiado al portapapeles')
    })
  }

  // Helpers
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
    const baseClasses = 'px-2 py-0.5 rounded-sm text-xs font-medium'
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
