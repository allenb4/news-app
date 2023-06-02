import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials';
import { http } from '@/utils/http';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'Email'
        },
        password: { label: 'Password', type: 'password' }
      },
      
      async authorize(credentials, req) {
        const { username: email, password } = credentials as {
          username: string
          password: string
        };
        const response = await http.post('/api/login', { email, password });
        const accessToken = response.data?.access_token;
        const userResponse = await http.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        return {
          ...userResponse.data,
          accessToken
        };
      },
    })
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    // @ts-ignore
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    // @ts-ignore
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  }
}

export default NextAuth(authOptions);
