/**
 * Lee una variable de entorno priorizando la configuración runtime (Docker)
 * sobre la configuración de build time (@ngx-env/builder).
 */
export function getEnv(key: string): string {
  const runtimeEnv = (window as any).__env
  const runtimeValue = normalizeEnvValue(runtimeEnv?.[key])
  if (runtimeValue !== undefined) {
    return runtimeValue
  }

  const ngxEnvValue = normalizeEnvValue(
    (typeof _NGX_ENV_ !== 'undefined' ? _NGX_ENV_ : undefined)?.[key],
  )
  if (ngxEnvValue !== undefined) {
    return ngxEnvValue
  }

  const buildTimeValue = normalizeEnvValue(import.meta.env[key])
  if (buildTimeValue !== undefined) {
    return buildTimeValue
  }

  return ''
}

function normalizeEnvValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim()
  if (
    normalized.length === 0 ||
    normalized.toLowerCase() === 'undefined' ||
    normalized.toLowerCase() === 'null'
  ) {
    return undefined
  }

  return normalized
}
