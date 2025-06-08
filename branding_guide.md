# BizzGuru - Branding and Customization Guide

This guide outlines the branding and customization steps for the BizzGuru platform (bizzguru.de), which is built on the Shopify Automation Tool.

## Brand Identity

### Brand Name
- **Full Name**: BizzGuru
- **Domain**: bizzguru.de
- **Tagline**: "AI-Powered Content Management for SMEs"

### Brand Colors
- **Primary Color**: #3B82F6 (Blue)
- **Secondary Color**: #10B981 (Green)
- **Accent Color**: #8B5CF6 (Purple)
- **Neutral Colors**: 
  - Dark: #1F2937
  - Light: #F9FAFB
  - Gray: #6B7280

### Typography
- **Headings**: Inter, sans-serif
- **Body Text**: Inter, sans-serif
- **Monospace**: Roboto Mono (for code examples)

## Frontend Customization

### Logo Implementation

1. Create a logo file at `/frontend/public/logo.svg`
2. Update the logo in the header component:

```jsx
// In frontend/src/components/Header.js
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="BizzGuru" 
            width={120} 
            height={40} 
            className="h-8 w-auto" 
          />
        </div>
        {/* Other header content */}
      </div>
    </header>
  );
};

export default Header;
```

### Favicon

1. Create favicon files in various sizes in `/frontend/public/`
2. Update the `_document.js` file:

```jsx
// In frontend/src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Theme Configuration

1. Update the Tailwind configuration:

```js
// In frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Primary color
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          500: '#10B981', // Secondary color
        },
        accent: {
          500: '#8B5CF6', // Accent color
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  // Other Tailwind config
};
```

2. Add the fonts to the `_document.js` file:

```jsx
// In frontend/src/pages/_document.js
<Head>
  {/* Other head elements */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
</Head>
```

## Application Customization

### Site Title and Metadata

Update the site title and metadata in `_app.js`:

```jsx
// In frontend/src/pages/_app.js
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>BizzGuru - AI-Powered Content Management for SMEs</title>
        <meta name="description" content="Manage your online content across multiple platforms with AI-powered tools designed for small and medium businesses." />
        <meta property="og:title" content="BizzGuru" />
        <meta property="og:description" content="AI-Powered Content Management for SMEs" />
        <meta property="og:url" content="https://bizzguru.de" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

### Email Templates

Update email templates with BizzGuru branding:

1. Create an email template directory:

```bash
mkdir -p backend/src/templates/emails
```

2. Create a base email template:

```html
<!-- backend/src/templates/emails/base.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #1F2937;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #3B82F6;
    }
    .header img {
      max-height: 50px;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6B7280;
    }
    .button {
      display: inline-block;
      background-color: #3B82F6;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://bizzguru.de/logo-white.svg" alt="BizzGuru">
    </div>
    <div class="content">
      {{content}}
    </div>
    <div class="footer">
      <p>&copy; 2025 BizzGuru. All rights reserved.</p>
      <p>bizzguru.de</p>
    </div>
  </div>
</body>
</html>
```

## Backend Customization

### Application Name

Update the application name in the backend:

```js
// In backend/src/config/app.js
module.exports = {
  name: 'BizzGuru',
  url: 'https://bizzguru.de',
  supportEmail: 'support@bizzguru.de',
  // Other app configuration
};
```

### Email Configuration

Set up email configuration with BizzGuru domain:

```js
// In backend/src/config/email.js
module.exports = {
  from: 'noreply@bizzguru.de',
  replyTo: 'support@bizzguru.de',
  // Other email configuration
};
```

## Domain Configuration

### DNS Setup

1. Configure DNS records for bizzguru.de:

```
Type    Name       Value                TTL
A       @          [Server IP]          3600
CNAME   www        bizzguru.de.         3600
MX      @          mail.bizzguru.de.    3600
TXT     @          v=spf1 include:_spf.bizzguru.de ~all  3600
```

2. Set up email DNS records if needed:

```
Type    Name       Value                TTL
MX      @          10 mail.bizzguru.de. 3600
TXT     _dmarc     v=DMARC1; p=none; rua=mailto:dmarc@bizzguru.de  3600
```

### SSL Certificate

Ensure SSL certificate is properly configured:

```bash
sudo certbot --nginx -d bizzguru.de -d www.bizzguru.de
```

## Content Customization

### Landing Page

Create a custom landing page for BizzGuru:

```jsx
// In frontend/src/pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white">
      <Head>
        <title>BizzGuru - AI-Powered Content Management for SMEs</title>
      </Head>

      {/* Hero section */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Manage your online content</span>
                  <span className="block text-primary-500">with AI power</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  BizzGuru helps small and medium businesses update their online content across multiple platforms with simple text instructions.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10">
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/demo" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10">
                      Live demo
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/hero-image.jpg"
            alt="BizzGuru dashboard preview"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      {/* Feature section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-secondary-500 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage your online content
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              BizzGuru makes it easy to keep your online presence up-to-date across all platforms.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature items */}
              {/* Add feature items here */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Testing the Branding

After implementing these changes:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Restart the application:
```bash
pm2 restart all
```

3. Visit https://bizzguru.de to verify the branding is correctly applied

## Brand Assets

Create the following brand assets:

1. Logo (SVG and PNG formats)
2. Favicon (multiple sizes)
3. Social media preview image
4. Email header image
5. Hero image for landing page

Store these in the `/frontend/public/` directory.
