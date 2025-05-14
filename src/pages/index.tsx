import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error !== "RefreshTokenError") return;
    signIn("keycloak"); // Force sign in to obtain a new set of access and refresh tokens
  }, [session?.error]);

  return status !== "loading" ? (
    <>
      {<pre>{JSON.stringify(session, null, 2)}</pre>}
      {!!session ? <SignOut /> : <SignIn />}
    </>
  ) : null;
}

const SignIn = () => {
  return <button onClick={() => signIn("keycloak")}>Signin</button>;
};

const SignOut = () => {
  return <button onClick={() => signOut()}>Signout</button>;
};
