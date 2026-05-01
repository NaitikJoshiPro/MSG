'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/chat')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-transparent border border-[#222] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-transparent border border-[#222] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>
      {error && (
        <p className="text-[#ff4444] text-xs">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#f0f0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
