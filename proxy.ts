import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";



const isProtectedRoute = createRouteMatcher([
  '/api/jobs(.*)', 
  '/api/scrapingjob(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // auth() sekarang mengembalikan Promise, jadi harus di-await sebelum memanggil .protect()
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Menangkap semua route kecuali static files
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};