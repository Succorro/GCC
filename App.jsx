import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './src/general/Router.jsx';
import { Loading } from './src/components/Loading.jsx';
import { AuthProvider } from './src/admin/hooks/useAuth.jsx';

export const PageWithHeader = ({ children }) => (
  <div className="flex h-full flex-col">{children}</div>
);

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Suspense
        fallback={
          <PageWithHeader>
            <Loading name="suspense" />
          </PageWithHeader>
        }
      >
        <div className="h-full w-[100vw] overflow-none bg-indigo-50 tracking-wide">
          <Router />
        </div>
      </Suspense>
    </BrowserRouter>
  </AuthProvider>
);
