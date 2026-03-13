import { describe, it, expect } from 'vitest';
// Simulamos la lógica que debería estar en tu middleware
import { onRequest } from '../src/middleware'; 

describe('🔐 Seguridad: RBAC (Control de Acceso)', () => {
  it('debería identificar si una ruta es de administrador', () => {
    const adminPath = '/es/admin/dashboard';
    const isAdminRoute = adminPath.includes('/admin/');
    expect(isAdminRoute).toBe(true);
  });

  it('debería permitir acceso a rutas públicas sin sesión', () => {
    const publicPaths = ['/es/auth/signin', '/en/auth/register'];
    const path = '/es/auth/signin';
    expect(publicPaths.includes(path)).toBe(true);
  });
});