export const config = {
  https: import.meta.env.HTTPS,
  googleOAuthClientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET,
  googleOAuthRedirect: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT,
  backendEndpoint: import.meta.env.VITE_BACKEND_ENDPOINT
}
