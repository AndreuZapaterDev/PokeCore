import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js'
import type { PokemonCard, PokemonDetail } from './pokeapi'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = supabaseEnabled
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// Auth helpers

export async function signUpWithEmail(email: string, password: string, username?: string) {
  if (!supabase) throw new Error('Supabase no está configurado')

  const payload: { email: string; password: string; options?: { data?: Record<string, unknown> } } = {
    email,
    password,
  }

  if (username?.trim()) {
    payload.options = {
      data: {
        username: username.trim(),
      },
    }
  }

  const { data, error } = await supabase.auth.signUp(payload)

  if (error) throw new Error(error.message)
  return data
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase no está configurado')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase no está configurado')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) throw new Error(error.message)
  return data
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase no está configurado')

  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getCurrentUser() {
  if (!supabase) return null

  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message)
  return data.user
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange(callback)
  return () => data.subscription.unsubscribe()
}

// **** Helpers: mapping entre filas Supabase y tipos de app ****

