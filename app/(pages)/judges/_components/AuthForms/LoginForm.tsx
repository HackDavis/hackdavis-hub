"use client";

import { useRouter } from "next/navigation";

import LoginAction from "@actions/auth/login";
import AuthForm from "@components/AuthForm/AuthForm";

export default function LoginForm() {
  const router = useRouter();

  const onSubmit = async (fields: any) => {
    return LoginAction(fields.email, fields.password);
  };

  const onSuccess = () => {
    router.push("/judges");
  };

  const formFields = [
    {
      name: "email" as const,
      type: "email",
      label: "Email",
      placeholder: "",
      readOnly: false,
    },
    {
      name: "password" as const,
      type: "password",
      label: "Password",
      placeholder: "",
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      role="judge"
      fields={formFields}
      buttonText="Log in →"
      linkText="Forgot Password?"
      linkHref="/judges/login/forgot-password"
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
