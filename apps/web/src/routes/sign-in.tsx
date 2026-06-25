import { useAuthActions } from '@convex-dev/auth/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const [step, setStep] = useState<'signIn' | 'signUp'>('signIn')
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="p-8 flex flex-col gap-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center">
        {step === 'signIn' ? 'Sign in' : 'Sign up'}
      </h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          setError(null)
          const formData = new FormData(event.currentTarget)
          void signIn('password', formData)
            .then(() => navigate({ to: '/' }))
            .catch((err: unknown) => {
              setError(
                err instanceof Error ? err.message : 'Sign in failed',
              )
            })
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="border rounded-md px-3 py-2 bg-white dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete={
              step === 'signIn' ? 'current-password' : 'new-password'
            }
            className="border rounded-md px-3 py-2 bg-white dark:bg-slate-900"
          />
        </label>
        <input name="flow" type="hidden" value={step} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
        >
          {step === 'signIn' ? 'Sign in' : 'Sign up'}
        </button>
        <button
          type="button"
          className="text-sm text-blue-600 underline hover:no-underline"
          onClick={() => {
            setStep(step === 'signIn' ? 'signUp' : 'signIn')
            setError(null)
          }}
        >
          {step === 'signIn'
            ? 'Need an account? Sign up'
            : 'Already have an account? Sign in'}
        </button>
      </form>
    </main>
  )
}
