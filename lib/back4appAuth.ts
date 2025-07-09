import Parse from './parseClient';

export async function signUp(email: string, password: string) {
  const user = new Parse.User();
  user.set('username', email);
  user.set('password', password);
  user.set('email', email);
  await user.signUp();
  return user;
}

export async function signIn(email: string, password: string) {
  return await Parse.User.logIn(email, password);
}

export async function signOut() {
  await Parse.User.logOut();
} 