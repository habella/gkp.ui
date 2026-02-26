#!/bin/sh
set -e

# Generar configuración de entorno en runtime
cat <<EOF > /usr/share/nginx/html/admin/env.js
(function() {
  window.__env = {
    NG_GATEKEEPER_API: "${NG_GATEKEEPER_API}",
    NG_APP_KEYCLOAK_URL: "${NG_APP_KEYCLOAK_URL}",
    NG_APP_KEYCLOAK_REALM: "${NG_APP_KEYCLOAK_REALM}",
    NG_APP_KEYCLOAK_CLIENT_ID: "${NG_APP_KEYCLOAK_CLIENT_ID}",
    NG_APP_DEVEXPRESS_LICENSE_KEY: "${NG_APP_DEVEXPRESS_LICENSE_KEY}"
  };
})();
EOF

exec "$@"
