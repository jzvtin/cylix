"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  const isSignIn = currentView === "sign-in"

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] rounded-[28px] overflow-hidden cx-glass">
      {/* Brand / trust panel */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-sand p-12 overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(201,150,58,0.35), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative">
          <span className="cx-eyebrow cx-eyebrow--light">Cylix Research</span>
          <h2 className="cx-h text-4xl xl:text-5xl text-sand mt-6 leading-[1.03]">
            Your research,{" "}
            <span className="text-gold-500">documented</span> and in one place.
          </h2>
          <p className="text-sand/70 mt-5 max-w-sm leading-relaxed">
            Your CoAs, orders, and lot history — organised, verifiable and
            always within reach.
          </p>
        </div>

        <ul className="relative flex flex-col gap-4 mt-10">
          {[
            "Certificates of Analysis for every lot",
            "Full order & shipment history",
            "Saved addresses for faster checkout",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sand/85">
              <span className="h-6 w-6 rounded-full bg-gold-500 text-ink flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <section className="bg-white/60 backdrop-blur-sm p-8 sm:p-12 flex flex-col">
        {/* Segmented toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-ink/5 self-center mb-8 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className={`flex-1 rounded-full py-2.5 text-sm font-display font-bold transition-colors ${
              isSignIn ? "bg-ink text-sand shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className={`flex-1 rounded-full py-2.5 text-sm font-display font-bold transition-colors ${
              !isSignIn ? "bg-ink text-sand shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Create account
          </button>
        </div>

        {isSignIn ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </section>
    </div>
  )
}

export default LoginTemplate
