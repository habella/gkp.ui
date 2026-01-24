import { CommonModule } from '@angular/common'
import {
  Component,
  computed,
  effect,
  inject,
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
  DxTextBoxModule,
} from 'devextreme-angular'
import { forkJoin } from 'rxjs'
import { HasRolesDirective } from '../../../../core/directives/hasRoles.directive'
import { NotifyService } from '../../../../core/services/notify.service'
import { ModalComponent } from '../../../../shared/components/modal/modal.component'
import { TabComponent, TabsComponent } from '../../../../shared/components/tabs'
import {
  ICreateRoleRequest,
  IRole,
  IRolePermissionRelation,
  IUpdateRoleRequest,
  IUserRoleRelation,
} from '../../models'
import { IPermission } from '../../models/permission.model'
import {
  PermissionService,
  RolePermissionRelationService,
  RoleService,
  UserRoleRelationService,
} from '../../services'

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTemplateModule,
    TabsComponent,
    TabComponent,
    ModalComponent,
    HasRolesDirective,
  ],
  templateUrl: './role-detail.html',
  styleUrl: './role-detail.scss',
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden p-4',
  },
})
export class RoleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly roleService = inject(RoleService)
  private readonly rolePermissionService = inject(RolePermissionRelationService)
  private readonly userRoleService = inject(UserRoleRelationService)
  private readonly permissionService = inject(PermissionService)
  private readonly notify = inject(NotifyService)

  // State
  roleId = signal<string | null>(null)
  isNew = computed(() => this.roleId() === 'new' || !this.roleId())
  loading = signal(false)
  saving = signal(false)
  activeTab = signal<number | string>('info')

  // Role data
  role = signal<IRole>({
    id: '',
    name: '',
    description: '',
  })

  // Form data
  formData = signal<ICreateRoleRequest>({
    name: '',
  })

  // Permissions management
  rolePermissions = signal<IRolePermissionRelation[]>([])
  availablePermissions = signal<IPermission[]>([])
  permissionsLoading = signal(false)
  selectedPermissionIds = signal<string[]>([])

  // Users management
  roleUsers = signal<IUserRoleRelation[]>([])
  usersLoading = signal(false)

  // Add permission modal
  showAddPermissionModal = signal(false)
  addPermissionLoading = signal(false)

  // Remove permission modal
  showRemovePermissionModal = signal(false)
  removePermissionLoading = signal(false)
  selectedRolePermission = signal<IRolePermissionRelation | null>(null)

  // Remove user modal
  showRemoveUserModal = signal(false)
  removeUserLoading = signal(false)
  selectedUserRole = signal<IUserRoleRelation | null>(null)

  private permissionsLoaded = false
  private availablePermissionsLoaded = false
  private usersLoaded = false

  constructor() {
    effect(() => {
      const tab = this.activeTab()
      if (tab === 'permissions' && !this.isNew()) {
        if (!this.permissionsLoaded) {
          this.loadRolePermissions()
          this.permissionsLoaded = true
        }
        if (!this.availablePermissionsLoaded) {
          this.loadAvailablePermissions()
          this.availablePermissionsLoaded = true
        }
      }

      if (tab === 'users' && !this.isNew() && !this.usersLoaded) {
        this.loadRoleUsers()
        this.usersLoaded = true
      }
    })
  }

  // Page title
  pageTitle = computed(() => (this.isNew() ? 'Nuevo Rol' : 'Editar Rol'))

  // Computed: permissions available to add (not already assigned)
  permissionsForSelect = computed(() => {
    const assigned = this.rolePermissions().map((rp) => rp.permissionId)
    return this.availablePermissions().filter((p) => !assigned.includes(p.id))
  })

  // Grouped permissions for display
  groupedPermissions = computed(() => {
    const permissions = this.permissionsForSelect()
    const groups: { [key: string]: IPermission[] } = {}
    permissions.forEach((p) => {
      const group = p.group || 'Sin grupo'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(p)
    })
    return groups
  })

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.roleId.set(id)

    if (!this.isNew()) {
      this.loadRole()
    }
  }

  loadRole(): void {
    const id = this.roleId()
    if (!id) return

    this.loading.set(true)
    this.roleService.getById(id).subscribe({
      next: (role) => {
        this.role.set(role)
        this.formData.set({ name: role.name })
        this.loading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar el rol')
        this.loading.set(false)
        this.router.navigate(['/roles'])
      },
    })
  }

  loadRolePermissions(): void {
    const id = this.roleId()
    if (!id) return

    this.permissionsLoading.set(true)
    this.rolePermissionService.getByRoleId(id).subscribe({
      next: (permissions) => {
        this.rolePermissions.set(permissions)
        this.permissionsLoading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar permisos del rol')
        this.permissionsLoading.set(false)
      },
    })
  }

  onRefreshPermissions(): void {
    this.loadRolePermissions()
    this.notify.success('Lista de permisos actualizada')
  }

  // Users management
  loadRoleUsers(): void {
    const id = this.roleId()
    if (!id) return

    this.usersLoading.set(true)
    this.roleService.getUsersByRoleId(id).subscribe({
      next: (users) => {
        this.roleUsers.set(users)
        this.usersLoading.set(false)
      },
      error: () => {
        this.notify.error('Error al cargar los usuarios del rol')
        this.usersLoading.set(false)
      },
    })
  }

  onRefreshUsers(): void {
    this.loadRoleUsers()
    this.notify.success('Lista de usuarios actualizada')
  }

  getUserFullName(data: any): string {
    const user = data?.user || data
    if (!user || (!user.firstName && !user.lastName)) return ''
    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
  }

  getUserEmail(data: any): string {
    const user = data?.user || data
    return user?.email || ''
  }

  onViewUser(userRole: IUserRoleRelation): void {
    const userId = userRole.userId || (userRole as any).id
    if (!userId) return
    this.router.navigate(['/users', userId])
  }

  onRemoveUser(userRole: IUserRoleRelation): void {
    this.selectedUserRole.set(userRole)
    this.showRemoveUserModal.set(true)
  }

  confirmRemoveUser(): void {
    const userRole = this.selectedUserRole()
    if (!userRole) return

    const relationId = userRole.id
    if (!relationId) {
      this.notify.error(
        'No se puede remover el usuario: ID de relación no encontrado',
      )
      return
    }

    this.removeUserLoading.set(true)
    this.userRoleService.delete(relationId).subscribe({
      next: () => {
        this.notify.success('Usuario removido del rol correctamente')
        this.closeRemoveUserModal()
        this.loadRoleUsers()
      },
      error: () => {
        this.notify.error('Error al remover el usuario')
        this.removeUserLoading.set(false)
      },
    })
  }

  closeRemoveUserModal(): void {
    this.showRemoveUserModal.set(false)
    this.removeUserLoading.set(false)
    this.selectedUserRole.set(null)
  }

  loadAvailablePermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (permissions) => this.availablePermissions.set(permissions),
      error: () => this.notify.error('Error al cargar permisos disponibles'),
    })
  }

  onSave(): void {
    if (this.isNew()) {
      this.createRole()
    } else {
      this.updateRole()
    }
  }

  createRole(): void {
    this.saving.set(true)
    this.roleService.create(this.formData()).subscribe({
      next: (role) => {
        this.notify.success('Rol creado correctamente')
        this.saving.set(false)
        this.router.navigate(['/roles', role.id])
      },
      error: () => {
        this.notify.error('Error al crear rol')
        this.saving.set(false)
      },
    })
  }

  updateRole(): void {
    const id = this.roleId()
    if (!id) return

    this.saving.set(true)
    const updateData: IUpdateRoleRequest = {
      id: id,
      name: this.formData().name,
    }

    this.roleService.update(updateData).subscribe({
      next: () => {
        this.notify.success('Rol actualizado correctamente')
        this.saving.set(false)
        this.loadRole()
      },
      error: () => {
        this.notify.error('Error al actualizar rol')
        this.saving.set(false)
      },
    })
  }

  onCancel(): void {
    this.router.navigate(['/roles'])
  }

  // Permissions management
  onAddPermission(): void {
    this.selectedPermissionIds.set([])
    this.showAddPermissionModal.set(true)
  }

  confirmAddPermission(): void {
    const permissionIds = this.selectedPermissionIds()
    const roleId = this.roleId()
    if (!permissionIds.length || !roleId) return

    this.addPermissionLoading.set(true)

    const requests = permissionIds.map((permissionId) =>
      this.rolePermissionService.create({ roleId, permissionId }),
    )

    forkJoin(requests).subscribe({
      next: () => {
        this.notify.success(
          `${permissionIds.length} permiso(s) asignado(s) correctamente`,
        )
        this.closeAddPermissionModal()
        this.loadRolePermissions()
      },
      error: () => {
        this.notify.error('Error al asignar permisos')
        this.addPermissionLoading.set(false)
      },
    })
  }

  closeAddPermissionModal(): void {
    this.showAddPermissionModal.set(false)
    this.addPermissionLoading.set(false)
    this.selectedPermissionIds.set([])
  }

  onSelectionChanged(e: any): void {
    this.selectedPermissionIds.set(e.selectedRowKeys)
  }

  onRemovePermission(rolePermission: IRolePermissionRelation): void {
    this.selectedRolePermission.set(rolePermission)
    this.showRemovePermissionModal.set(true)
  }

  confirmRemovePermission(): void {
    const rolePermission = this.selectedRolePermission()
    if (!rolePermission) return

    this.removePermissionLoading.set(true)
    this.rolePermissionService.delete(rolePermission.id).subscribe({
      next: () => {
        this.notify.success('Permiso removido correctamente')
        this.closeRemovePermissionModal()
        this.loadRolePermissions()
      },
      error: () => {
        this.notify.error('Error al remover permiso')
        this.removePermissionLoading.set(false)
      },
    })
  }

  closeRemovePermissionModal(): void {
    this.showRemovePermissionModal.set(false)
    this.removePermissionLoading.set(false)
    this.selectedRolePermission.set(null)
  }

  getPermissionName(data: any): string {
    const permissionId =
      data.permissionId || data.id || (typeof data === 'string' ? data : null)
    if (!permissionId) return 'Sin nombre'

    // Si ya viene el objeto permiso (nesteado), usarlo
    if (data.permission?.name) return data.permission.name

    const permission = this.availablePermissions().find(
      (p) => p.id === permissionId,
    )
    return permission?.name || (typeof data === 'string' ? data : 'Sin nombre')
  }

  getPermissionDescription(data: any): string {
    const permissionId =
      data.permissionId || data.id || (typeof data === 'string' ? data : null)
    if (!permissionId) return ''

    if (data.permission?.description) return data.permission.description
    if (data.description) return data.description

    const permission = this.availablePermissions().find(
      (p) => p.id === permissionId,
    )
    return permission?.description || ''
  }

  getPermissionGroup(data: any): string {
    const permissionId =
      data.permissionId || data.id || (typeof data === 'string' ? data : null)
    if (!permissionId) return 'Sin grupo'

    if (data.permission?.group) return data.permission.group
    if (data.group) return data.group

    const permission = this.availablePermissions().find(
      (p) => p.id === permissionId,
    )
    return permission?.group || 'Sin grupo'
  }

  getPermissionSubGroup(data: any): string {
    const permissionId =
      data.permissionId || data.id || (typeof data === 'string' ? data : null)
    if (!permissionId) return 'General'

    if (data.permission?.subGroup) return data.permission.subGroup
    if (data.subGroup) return data.subGroup

    const permission = this.availablePermissions().find(
      (p) => p.id === permissionId,
    )
    return permission?.subGroup || 'General'
  }

  updateFormField(field: keyof ICreateRoleRequest, value: string): void {
    this.formData.update((data) => ({ ...data, [field]: value }))
  }
}
