import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';



const client = new ApolloClient({

  uri: 'http://localhost:4000/',

  cache: new InMemoryCache(),

});


// Supported in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

);