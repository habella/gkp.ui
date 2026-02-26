import { getEnv } from '../app/core/get-env'

export const environment = {
  production: false,
  apiUrl: getEnv('NG_GATEKEEPER_API'),
  name: 'fleet',
}
