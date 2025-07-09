import { createClient } from 'urql';
import nhost from './nhost';

export const urqlClient = createClient({
  url: `${process.env.NHOST_BACKEND_URL}/v1/graphql`,
  fetchOptions: () => {
    const token = nhost.auth.getAccessToken();
    return {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    };
  },
}); 