import './globals.css'

export const metadata = {
  title: 'SimTech-Software',
  description: 'Web-based tool to explore SimTech software',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="bg-black overscroll-none min-h-screen pattern-wavy pattern-gray-900 pattern-bg-black pattern-size-32 pattern-opacity-100"
      >
        <main>
          {children}
        </main>
      </body>
    </html >
  )
}
