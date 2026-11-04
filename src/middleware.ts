import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'it', 'de', 'es', 'fr'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(it|en|de|es|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
