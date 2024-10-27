import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import './globals.css'
import { Button, NextUIProvider } from '@nextui-org/react'

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
              <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center space-y-6 max-w-md px-4">
                  {/* Logo/Branding */}
                  <h1 className="text-4xl font-bold text-white">
                    CollegeFreeway
                  </h1>
                  
                  {/* Welcome Message */}
                  <p className="text-gray-300 text-lg">
                    Your one-stop platform for managing college applications with ease.
                  </p>
                  
                  {/* Sign In Button */}
                  <SignInButton mode="modal">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-white font-medium rounded-full px-8 py-2"
                    >
                      Get Started
                    </Button>
                  </SignInButton>
                  
                  {/* Additional Info */}
                  <p className="text-sm text-gray-400 mt-4">
                    Join thousands of students simplifying their college application process
                  </p>
                </div>
              </div>
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