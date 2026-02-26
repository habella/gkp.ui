/**
 * Lee una variable de entorno priorizando la configuración runtime (Docker)
 * sobre la configuración de build time (@ngx-env/builder).
 */
export function getEnv(key: string): string {
  const runtimeEnv = (window as any).__env
  if (runtimeEnv && runtimeEnv[key]) {
    return runtimeEnv[key]
  }
  return import.meta.env[key]
}
