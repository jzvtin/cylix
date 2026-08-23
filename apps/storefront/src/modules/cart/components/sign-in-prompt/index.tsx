import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gold-500/25 bg-gold-50/60 px-4 py-3">
      <p className="text-[13px] text-ink/70">
        <span className="font-display font-bold text-ink">
          Already have an account?
        </span>{" "}
        Sign in for faster checkout.
      </p>
      <LocalizedClientLink
        href="/account"
        data-testid="sign-in-button"
        className="shrink-0 rounded-full border border-ink/15 bg-white px-4 py-1.5 font-display text-[12.5px] font-bold text-ink transition-colors hover:border-gold-500 hover:text-gold-700"
      >
        Sign in
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
