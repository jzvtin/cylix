import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full flex flex-col" data-testid="login-page">
      <div className="text-center mb-8">
        <h1 className="cx-h text-3xl sm:text-4xl">
          Welcome <em>back</em>
        </h1>
        <p className="text-ink/60 mt-3">
          Sign in to your CoAs, orders, and lot history.
        </p>
      </div>

      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-sm text-ink/80 bg-gold-50 border border-gold-200 rounded-2xl p-4"
          data-testid="login-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please verify your email, then sign in.
        </div>
      )}

      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 !rounded-full">
          Sign in
        </SubmitButton>
      </form>

      <span className="text-center text-ink/60 text-sm mt-8">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-gold-700 font-semibold underline underline-offset-2 hover:text-gold-600"
          data-testid="register-button"
        >
          Join Cylix Research
        </button>
      </span>
    </div>
  )
}

export default Login
