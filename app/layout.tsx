import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { NextUIProvider } from '@nextui-org/react'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <NextUIProvider>
          <SignedOut>
            <SignInButton/>
          </SignedOut>
          <SignedIn>
          {children}
          </SignedIn>
      </NextUIProvider>
        </body>
      </html>

    </ClerkProvider>
  )
}