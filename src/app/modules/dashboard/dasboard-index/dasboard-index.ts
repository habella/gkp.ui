import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { DxChartModule } from 'devextreme-angular/ui/chart'
import { DxCircularGaugeModule } from 'devextreme-angular/ui/circular-gauge'
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart'
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component'

interface PlantSummary {
  id: string
  name: string
  location: string
  turbines: number
  capacity: number
  status: 'online' | 'maintenance' | 'offline'
  production: number
  efficiency: number
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  plant: string
  timestamp: Date
}

@Component({
  selector: 'app-dasboard-index',
  standalone: true,
  imports: [
    CommonModule,
    DxChartModule,
    DxPieChartModule,
    DxCircularGaugeModule,
    SvgIconComponent,
  ],
  templateUrl: './dasboard-index.html',
  styleUrl: './dasboard-index.scss',
  host: {
    class:
      'dashboard-index flex flex-col h-full w-full overflow-hidden bg-surface-50',
  },
})
export class DasboardIndex {
  // Stats principales
  totalPlants = signal(12)
  totalTurbines = signal(156)
  totalCapacity = signal(468) // MW
  currentProduction = signal(312.5) // MW
  avgEfficiency = signal(87.3)
  co2Saved = signal(15420) // Toneladas

  // Última actualización
  lastUpdateTime = signal(this.formatTime(new Date()))

  // Datos de plantas
  plants = signal<PlantSummary[]>([
    {
      id: '1',
      name: 'Parque Sierra Norte',
      location: 'Burgos, España',
      turbines: 24,
      capacity: 72,
      status: 'online',
      production: 58.4,
      efficiency: 81.1,
    },
    {
      id: '2',
      name: 'Parque Costa Brava',
      location: 'Girona, España',
      turbines: 18,
      capacity: 54,
      status: 'online',
      production: 48.2,
      efficiency: 89.3,
    },
    {
      id: '3',
      name: 'Parque Meseta Central',
      location: 'Palencia, España',
      turbines: 32,
      capacity: 96,
      status: 'online',
      production: 82.1,
      efficiency: 85.5,
    },
    {
      id: '4',
      name: 'Parque Alto Aragón',
      location: 'Huesca, España',
      turbines: 15,
      capacity: 45,
      status: 'maintenance',
      production: 28.6,
      efficiency: 63.6,
    },
    {
      id: '5',
      name: 'Parque Valle del Ebro',
      location: 'Zaragoza, España',
      turbines: 28,
      capacity: 84,
      status: 'online',
      production: 71.3,
      efficiency: 84.9,
    },
  ])

  // Alertas recientes
  recentAlerts = signal<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Turbina T-15 requiere mantenimiento preventivo',
      plant: 'Sierra Norte',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'error',
      message: 'Fallo en sensor de velocidad - Turbina T-08',
      plant: 'Alto Aragón',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'info',
      message: 'Mantenimiento programado completado',
      plant: 'Costa Brava',
      timestamp: new Date(Date.now() - 7200000),
    },
  ])

  // Datos para el gráfico de producción
  productionData = [
    { month: 'Ene', production: 285, target: 300 },
    { month: 'Feb', production: 298, target: 300 },
    { month: 'Mar', production: 312, target: 320 },
    { month: 'Abr', production: 335, target: 340 },
    { month: 'May', production: 358, target: 360 },
    { month: 'Jun', production: 342, target: 350 },
    { month: 'Jul', production: 318, target: 330 },
    { month: 'Ago', production: 295, target: 310 },
    { month: 'Sep', production: 328, target: 340 },
    { month: 'Oct', production: 352, target: 355 },
    { month: 'Nov', production: 338, target: 345 },
    { month: 'Dic', production: 312, target: 320 },
  ]

  // Datos para distribución de estado
  statusDistribution = [
    { status: 'Operativas', count: 142, color: '#10b981' },
    { status: 'Mantenimiento', count: 10, color: '#f59e0b' },
    { status: 'Fuera de servicio', count: 4, color: '#ef4444' },
  ]

  getStatusClass(status: string): string {
    switch (status) {
      case 'online':
        return 'badge-online'
      case 'maintenance':
        return 'badge-warning'
      case 'offline':
        return 'badge-error'
      default:
        return 'badge-primary'
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'online':
        return 'Operativo'
      case 'maintenance':
        return 'Mantenimiento'
      case 'offline':
        return 'Fuera de servicio'
      default:
        return status
    }
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'icons/alert-triangle.svg'
      case 'error':
        return 'icons/alert-circle.svg'
      default:
        return 'icons/alert-circle.svg'
    }
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'warning':
        return 'bg-accent-50 border-accent-200 text-accent-700'
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-600'
      default:
        return 'bg-primary-50 border-primary-200 text-primary-700'
    }
  }

  formatTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Hace menos de 1 hora'
    if (hours === 1) return 'Hace 1 hora'
    return `Hace ${hours} horas`
  }
}
