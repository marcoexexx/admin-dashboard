import { StoreProvider } from '@/context/store'
import { FacebookProvider } from 'react-facebook'
import ThemeWrapper from '@/themes/themeWrapper'
import { StylesProvider } from '@mui/styles'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getConfig from '@/libs/getConfig'
import { AuthProvider } from '.';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 5
    }
  }
})


interface ProvidersProps {
  children: React.ReactNode
}

export function Providers(props: ProvidersProps) {
  const { children } = props

  return (
    <FacebookProvider appId={getConfig("facebookAppId")} chatSupport>
      <StylesProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StoreProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ThemeWrapper>
                  {children}
                </ThemeWrapper>
              </AuthProvider>
            </QueryClientProvider>
          </StoreProvider>
        </LocalizationProvider>
      </StylesProvider>
    </FacebookProvider>
  )
}
