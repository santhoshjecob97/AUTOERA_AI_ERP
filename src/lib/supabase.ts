/**
 * @deprecated Supabase has been removed. Authentication is handled by Django JWT.
 * This file is kept as a stub to prevent import errors during migration cleanup.
 * All authentication is now managed via context/AuthContext.tsx → Django /api/v1/auth/
 */
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => {
      throw new Error('Supabase auth has been removed. Use Django JWT authentication.');
    },
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    updateUser: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: null, error: new Error('Supabase removed. Use Django API.') }) }),
    insert: () => Promise.resolve({ error: new Error('Supabase removed. Use Django API.') }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
  removeChannel: () => {},
};
