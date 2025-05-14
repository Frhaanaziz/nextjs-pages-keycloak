import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

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
