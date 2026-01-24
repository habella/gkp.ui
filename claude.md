# Fleet UI - Guía de Desarrollo

## Información del Proyecto

Este es un proyecto Angular 21 que forma parte del sistema Fleet. Utiliza pnpm como manejador de paquetes.

## Manejador de Paquetes

**IMPORTANTE:** Este proyecto utiliza **pnpm** como manejador de paquetes, NO npm.

## Comandos Principales

### Instalación de Dependencias

```bash
pnpm install
```

### Desarrollo

```bash
pnpm start          # Inicia el servidor de desarrollo y abre el navegador
pnpm run watch      # Compila con observación de cambios
```

### Compilación

```bash
pnpm run build              # Compilación para desarrollo
pnpm run build:prod         # Compilación optimizada para producción
pnpm run build:stg          # Compilación para staging
```

### Pruebas

```bash
pnpm test           # Ejecuta las pruebas unitarias
```

### Angular CLI

```bash
pnpm ng [comando]   # Ejecuta comandos de Angular CLI
```

## Stack Tecnológico

- **Framework:** Angular 21
- **TypeScript:** 5.9
- **UI Components:**
  - DevExtreme 25.1.7
  - @rauroszm/hermes-ui-kit 26.1.0
  - Angular CDK 21.0.0
- **Estilos:** Tailwind CSS 3
- **State Management:** NgRx Signals 20.1.0
- **Autenticación:** Keycloak Angular 20.0.0
- **Iconos:** angular-svg-icon
- **Excel:** ExcelJs 4.4.0
- **Gantt:** devexpress-gantt 3.0.20

## Estructura del Proyecto

```
fleet.ui/
├── src/                   # Código fuente de la aplicación
├── src/app/modules        # Modlulos principales de la aplicación
├── src/app/shared         # Componentes, servicios y utilidades compartidas
├── src/app/core           # Servicios centrales y configuración
├── public/                # Archivos públicos estáticos
├── .angular/              # Cache de Angular
├── node_modules/          # Dependencias (gestionadas por pnpm)
├── angular.json           # Configuración de Angular
├── tailwind.config.js     # Configuración de Tailwind CSS
├── tsconfig.json          # Configuración de TypeScript
├── .env                   # Variables de entorno
└── package.json           # Dependencias y scripts del proyecto
```

## Configuración

### Variables de Entorno

El proyecto utiliza un archivo `.env` para las variables de entorno. Revisa este archivo para configurar las URLs de API y otras configuraciones necesarias.

### Configuración de Angular

- El proyecto usa `@ngx-env/builder` para el manejo de variables de entorno
- La configuración está en `angular.json`
- Hay configuraciones separadas para development, staging y production

## Notas Importantes

1. **Memory Limit:** El proyecto está configurado con `--max-old-space-size=36384` para manejar grandes volúmenes de datos
2. **PNPM Overrides:** Se están forzando versiones específicas de Angular core, common, router y build a la versión 21
3. **Keycloak:** El proyecto usa Keycloak para autenticación, asegúrate de tener las configuraciones correctas en el `.env`

## Generación de Código

### Componente

```bash
pnpm ng generate component nombre-componente
```

### Servicio

```bash
pnpm ng generate service nombre-servicio
```

### Módulo

```bash
pnpm ng generate module nombre-modulo
```

Para más opciones:

```bash
pnpm ng generate --help
```

## Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Documentación de DevExtreme](https://js.devexpress.com/Documentation/Guide/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de pnpm](https://pnpm.io)
