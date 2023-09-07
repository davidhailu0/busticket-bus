import { ApolloProvider } from '@apollo/client';
import client from "../utils/ApolloServer"
import '../styles/globals.css'
import 'antd/dist/antd.min.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps}) {

  return (<ApolloProvider client={client}>
    <Component {...pageProps}/>
  </ApolloProvider>
  )
}

export default MyApp
