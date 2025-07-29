import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ADmyBRAND Insights',
  description: 'Modern Analytics Dashboard built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  try {
                    const theme = localStorage.getItem('admybrand-theme');
                    if (theme) return theme;
                  } catch (e) {
                    // Local storage is unavailable
                  }
                  // Default to light theme if no preference is found
                  return 'light';
                }
                const theme = getInitialTheme();
                document.documentElement.className = theme;
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
