import * as React from "react"

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API_URL ?? "http://localhost:8000"
const AUTH_URL = `${API_BASE.replace(/\/$/, "")}/api/v1/auth`

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundColor: "#FFD1A3" }}
    >
      <div className="flex flex-col items-center gap-8 max-w-md w-full flex-1 justify-center">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/agentos-logo.png"
          alt="AgentOS"
          className="w-16 h-16 object-contain"
        />

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign in to AgentOS
        </h1>

        {/* Login Card */}
        <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-sm">
          <a
            href={AUTH_URL}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-colors hover:bg-gray-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.7099C3.96409 10.1699 3.68182 9.59308 3.68182 8.99989C3.68182 8.40671 3.96409 7.82989 3.96409 7.28989V4.95807H0.957273C0.347727 6.17353 0 7.54762 0 8.99989C0 10.4522 0.347727 11.8263 0.957273 13.0417L3.96409 10.7099Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>
        </div>
      </div>

      {/* Footer - fixed at bottom center */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-600">
        <a href="#" className="hover:text-gray-800 transition-colors">
          Terms of Service
        </a>
        {" and "}
        <a href="#" className="hover:text-gray-800 transition-colors">
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}
