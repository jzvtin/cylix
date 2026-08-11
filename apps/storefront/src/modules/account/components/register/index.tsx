"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full flex flex-col" data-testid="register-page">
      <div className="text-center mb-8">
        <h1 className="cx-h text-3xl sm:text-4xl">
          Become a <em>member</em>
        </h1>
        <p className="text-ink/60 mt-3">
          Create your Cylix Research profile — CoAs, orders and lot history in
          one place.
        </p>
      </div>

      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-sm text-ink/80 bg-gold-50 border border-gold-200 rounded-2xl p-4"
          data-testid="register-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please check your inbox to verify your email, then sign in.
        </div>
      )}

      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <div className="grid grid-cols-2 gap-x-3">
            <Input
              label="First name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Last name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <span className="text-center text-ink/55 text-xs mt-6 leading-relaxed">
          By creating an account, you agree to Cylix Research&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="text-gold-700 underline underline-offset-2"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="text-gold-700 underline underline-offset-2"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6 !rounded-full" data-testid="register-button">
          Create account
        </SubmitButton>
      </form>

      <span className="text-center text-ink/60 text-sm mt-8">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-gold-700 font-semibold underline underline-offset-2 hover:text-gold-600"
        >
          Sign in
        </button>
      </span>
    </div>
  )
}

export default Register
