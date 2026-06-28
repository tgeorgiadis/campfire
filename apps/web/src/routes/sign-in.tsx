import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useEffect, useState } from 'react'
import { SignInScreen, SignInSkeleton } from '@campfire/ui'

export const Route = createFileRoute('/sign-in')({
  ssr: false,
  component: SignIn,
})

function SignIn() {
  const { signIn } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void navigate({ to: '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading || submitting || isAuthenticated) {
    return <SignInSkeleton />
  }

  return (
    <SignInScreen
      step={step}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      error={error}
      onToggleStep={() => {
        setStep(step === 'signIn' ? 'signUp' : 'signIn')
        setError(null)
      }}
      onSubmit={() => {
        setError(null)
        setSubmitting(true)
        const formData = new FormData()
        formData.set('email', email)
        formData.set('password', password)
        formData.set('flow', step)
        void signIn('password', formData).catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Sign in failed')
          setSubmitting(false)
        })
      }}
    />
  )
}
