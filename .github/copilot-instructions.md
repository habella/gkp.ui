# Fleet UI - Guía de Desarrollo para IA

Este repositorio contiene la interfaz de usuario del sistema Fleet, construida con **Angular 21** y optimizada para alto rendimiento.

## 🚀 Conceptos Clave

- **Package Manager:** Usa **pnpm**. Nunca `npm` o `yarn`.
- **Zoneless:** La aplicación funciona sin Zone.js (`provideZonelessChangeDetection`). Usa **Angular Signals** para toda la reactividad.
- **Standalone:** Todos los componentes, directivas y pipes deben ser `standalone: true`.

## 🛠 Patrones de Código

### 1. Inyección de Dependencias

Usa la función `inject()` exclusivamente. Evita la inyección por constructor.

```typescript
private readonly userService = inject(UserService);
private readonly router = inject(Router);
```

### 2. Gestión de Estado

- Usa `signal()`, `computed()` y `effect()`.
- Para estados de servicios, extiende de `StoreService<T>` en [src/app/core/services/store.service.ts](src/app/core/services/store.service.ts).
- Usa el nuevo flujo de control de Angular:

```html
@if (loading()) { ... } @else { ... } @for (item of items(); track item.id) {
... }
```

### 3. Componentes UI (DevExtreme + Tailwind)

- Usa **DevExtreme** para componentes complejos (grids, schedulers, charts).
- Usa **Tailwind CSS** para maquetación y estilos rápidos.
- Las clases `host` en componentes deben usarse para layout:

```typescript
host: { class: 'flex flex-col h-full w-full' }
```

### 4. Seguridad y Roles

Usa la directiva `*hasRoles` para control de acceso granular en el template:

```html
<div *hasRoles="['admin', 'super_admin']">...</div>
```

## 📂 Estructura de Archivos

- `src/app/core`: Servicios globales, interceptores y configuraciones singleton.
- `src/app/shared`: Componentes reutilizables (`modal`, `svg-icon`, `card-info`) y módulos base.
- `src/app/modules`: Módulos de negocio (Dashboard, Security, etc.). Cada uno con sus propias `routes.ts`.

## 🖱 Comandos Útiles

- Iniciar: `pnpm start`
- Testear: `pnpm test`
- Build (Prod): `pnpm run build:prod`

> **Nota:** El proyecto tiene un límite de memoria alto (`--max-old-space-size=36384`) configurado en los scripts de `package.json` para manejar la compilación de grandes volúmenes de datos.

## 📝 Convenciones

- Idioma del código (variables, métodos): **Inglés**.
- Idioma de la UI (labels, mensajes): **Español**.
- Notificaciones: Usa `NotifyService` para errores y alertas.
- Configuración: Accede a variables de entorno vía `@ngx-env/builder`.
