"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Header } from "@/components/header"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {isSignIn ? (
            <SignInForm onToggleMode={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onToggleMode={() => setIsSignIn(true)} />
          )}
        </div>
      </main>
    </div>
  )
}
