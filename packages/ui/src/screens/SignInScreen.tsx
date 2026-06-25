import { Text, View } from 'react-native'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryButton, TextButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'

export function SignInScreen({
  step,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleStep,
  error,
}: {
  step: 'signIn' | 'signUp'
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onToggleStep: () => void
  error: string | null
}) {
  return (
    <AuthLayout
      title={step === 'signIn' ? 'Sign in' : 'Sign up'}
      subtitle="Share photos from your events"
    >
      <View className="gap-3">
        <TextField
          label="Email"
          value={email}
          onChangeText={onEmailChange}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          placeholder="Password"
          secureTextEntry
        />
        {error ? <Text className="text-sm text-ig-red">{error}</Text> : null}
        <PrimaryButton
          label={step === 'signIn' ? 'Log in' : 'Sign up'}
          onPress={onSubmit}
        />
        <View className="items-center pt-2 border-t border-ig-border mt-2">
          <TextButton
            label={
              step === 'signIn'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'
            }
            onPress={onToggleStep}
          />
        </View>
      </View>
    </AuthLayout>
  )
}

export function JoinScreen({
  invalid,
  onTryBoard,
}: {
  invalid: boolean
  onTryBoard?: () => void
}) {
  if (invalid) {
    return (
      <View className="min-h-screen bg-ig-page items-center justify-center p-8 gap-4">
        <Text className="text-2xl font-semibold text-ig-text">Invalid guest link</Text>
        <Text className="text-sm text-ig-muted text-center max-w-sm">
          This link is missing a guest token. Ask the campfire owner for a new QR code.
        </Text>
        {onTryBoard ? (
          <TextButton label="Try opening the board anyway" onPress={onTryBoard} />
        ) : null}
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-ig-page items-center justify-center p-8">
      <Text className="text-sm text-ig-muted">Joining campfire…</Text>
    </View>
  )
}
