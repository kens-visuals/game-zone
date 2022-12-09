import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;800&display=swap"
          rel="stylesheet"
        />

        {/* <!-- HTML Meta Tags --> */}
        {/* <meta name="title" content="Pomodoro App" />
        <meta
          name="description"
          content="Pomodoro App built with Next.JS, TypeScript, Tailwind CSS, and Framer Motion"
        /> */}

        {/* <!-- Facebook Meta Tags --> */}
        {/* <meta
          property="og:url"
          content="https://pomodoro-app-mu-seven.vercel.app/"
        />
        <meta property="og:title" content="Pomodoro App" />
        <meta
          property="og:description"
          content="Pomodoro App built with Next.JS, TypeScript, Tailwind CSS, and Framer Motion"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/kens-visuals/ken.engineer/main/public/assets/seo-img.png"
        /> */}

        {/* <!-- Twitter Meta Tags --> */}
        {/* <meta name="twitter:card" content="summary_large_image" />

        <meta property="twitter:domain" content="Pomodoro App" />
        <meta
          property="twitter:url"
          content="https://pomodoro-app-mu-seven.vercel.app/"
        />
        <meta name="twitter:title" content="Pomodoro App" />
        <meta
          name="twitter:description"
          content="Pomodoro App built with Next.JS, TypeScript, Tailwind CSS, and Framer Motion"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/kens-visuals/ken.engineer/main/public/assets/seo-img.png"
        /> */}

        {/* Favicon */}
        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
