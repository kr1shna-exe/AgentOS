import { Sora } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: "AgentOS",
  description: "AI-powered AgentOS",
  icons: {
    icon: [
      { url: "/agentos-logo.png", type: "image/png", sizes: "32x32" },
      { url: "/agentos-logo.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/agentos-logo.png",
    apple: "/agentos-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
