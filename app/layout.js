import './globals.css'

export const metadata = {
  title: 'AIO - AI Optimization',
  description: 'Track brand visibility in AI model responses',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
