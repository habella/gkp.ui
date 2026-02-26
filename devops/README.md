# Despliegue - Gatekeeper UI

Configuración de Docker para construir y desplegar la aplicación Angular con Nginx.

## Estructura

```
.dockerignore            # Archivos excluidos del contexto de build (raíz del proyecto)
devops/
├── Dockerfile           # Multi-stage build (Node 22 + Nginx 1.27)
├── docker-compose.yml   # Orquestación de servicios
├── entrypoint.sh        # Inyección de variables de entorno en runtime
├── nginx.conf           # Configuración de Nginx (SPA con base-href /admin/)
└── README.md
```

## Requisitos

- Docker >= 24
- Docker Compose >= 2.20

## Build

### Con Docker Compose (desde `devops/`)

```bash
cd devops
docker compose build
```

### Con Docker CLI (desde la raíz del proyecto)

```bash
docker build --secret id=npmrc,src=.npmrc -f devops/Dockerfile -t registry.gitlab.com/rauroszm/gatekeeper.ui:26.0.1 .
```

## Ejecutar

### Con Docker Compose

```bash
cd devops
docker compose up -d
```

Acceder a: `http://localhost:8084/admin/`

### Con Docker CLI

```bash
docker run -d -p 8084:80 --env-file .env gatekeeper:latest
```

## Variables de entorno

| Variable                        | Descripción               |
| ------------------------------- | ------------------------- |
| `NG_GATEKEEPER_API`             | URL del API backend       |
| `NG_APP_KEYCLOAK_URL`           | URL del servidor Keycloak |
| `NG_APP_KEYCLOAK_REALM`         | Realm de Keycloak         |
| `NG_APP_KEYCLOAK_CLIENT_ID`     | Client ID de Keycloak     |
| `NG_APP_DEVEXPRESS_LICENSE_KEY` | Licencia de DevExtreme    |

Las variables se inyectan en **runtime** mediante `entrypoint.sh`, lo que permite usar la misma imagen en distintos entornos.
