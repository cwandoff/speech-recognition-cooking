import type { AppProps } from "next/app"
import * as React from 'react';
import 'regenerator-runtime/runtime'

export default function MyApp({ Component, pageProps }:AppProps) {
  return <Component {...pageProps} />
}

// export default MyApp;
