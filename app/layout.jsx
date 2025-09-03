    import { Providers } from './providers';
    import './globals.css';

    export const metadata = {
      title: 'QuickTip Base',
      description: 'Send and receive instant tips on Base with ease.',
    };

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
  