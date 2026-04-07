import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../src/lib/supabase';

describe('🗄️ Cliente de Supabase', () => {
  it('debería estar definido el cliente de Supabase', () => {
    expect(supabase).toBeDefined();
  });

  it('debería manejar errores de autenticación simulados', async () => {
    const mockAuth = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials', status: 400 } as any
    });

    const { error } = await supabase.auth.signInWithPassword({
      email: 'test@robotics.com',
      password: 'wrong-password'
    });

    expect(error?.message).toBe('Invalid credentials');
  });
});