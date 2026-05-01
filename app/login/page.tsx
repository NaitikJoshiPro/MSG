import { LoginForm } from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/chat')

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">MSG</h1>
          <p className="mt-2 text-sm text-[#666]">Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
