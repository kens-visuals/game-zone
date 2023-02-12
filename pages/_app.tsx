import { useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';
import { db, firebaseConfig } from '../firebase/firebase.config';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirestoreProvider sdk={db}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  );
}
