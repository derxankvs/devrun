import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'DevRun',
  description: 'Um editor de código moderno com funcionalidades potencializadas por IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-mono antialiased`}>
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={true}
  disableTransitionOnChange={true}
>
  {children}
</ThemeProvider>
      </body>
    </html>
  );
}
