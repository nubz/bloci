import React from "react"
import AuthSection from "./../components/AuthSection"
import { useRouter } from '../util/router'

function AuthPage(props) {
  const router = useRouter()

  return (
    <AuthSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      inputSize="lg"
      type={router.query.type}
      providers={["google"]}
      afterAuthPath={router.query.next || "/dashboard"}
    />
  );
}

export default AuthPage;
