const ROLE_ALIASES = {
  admin: "Administrador",
  administrador: "Administrador",
  empleado: "Administrador",
  supervisor: "Supervisor",
  auditor: "Auditor",
  agente: "Agente",
  agent: "Agente",
  recepcionista: "Asistente",
  asistente: "Asistente",
  cliente: "Cliente",
  client: "Cliente",
}

const KNOWN_ROLES = [
  "Administrador",
  "Supervisor",
  "Auditor",
  "Agente",
  "Asistente",
  "Cliente",
]

export const ROLE_PRIORITY = [...KNOWN_ROLES]

export const normalizeRoleName = (roleName) => {
  if (!roleName) return null
  const normalizedKey = String(roleName).trim().toLowerCase()
  return ROLE_ALIASES[normalizedKey] || String(roleName).trim()
}

export const normalizeRoles = (roles = []) =>
  [...new Set(roles.map(normalizeRoleName).filter(Boolean))]

export const getPrimaryRole = (roles = []) => {
  const normalizedRoles = normalizeRoles(roles)
  return ROLE_PRIORITY.find((role) => normalizedRoles.includes(role)) || normalizedRoles[0] || null
}

export const userHasAccess = (user, requiredRoles = []) => {
  if (user?.es_admin) return true
  if (!requiredRoles.length) return true

  const normalizedUserRoles = normalizeRoles(user?.roles || [])
  const normalizedRequiredRoles = normalizeRoles(requiredRoles)

  return normalizedRequiredRoles.some((role) => normalizedUserRoles.includes(role))
}

export const userHasPermission = (user, moduleOrCode, permissionCode) => {
  if (user?.es_admin) return true
  if (!moduleOrCode) return false

  const backendPermissions = user?.permisos_codigos || []

  if (!permissionCode) {
    const normalizedRole = normalizeRoleName(moduleOrCode)

    if (KNOWN_ROLES.includes(normalizedRole)) {
      return userHasAccess(user, [normalizedRole])
    }

    return backendPermissions.includes(moduleOrCode)
  }

  if (moduleOrCode === "backups" && (permissionCode === "crear" || permissionCode === "restaurar")) {
    return backendPermissions.includes("administrar_backups")
  }

  return backendPermissions.includes(permissionCode)
}
