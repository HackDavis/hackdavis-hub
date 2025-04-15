"use client";

import { signOut } from "auth";

export default function LogoutButton({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: object;
}) {
  return (
    <button
      style={style}
      onClick={async () => {
        "use server";
        await signOut();
      }}
    >
      {children}
    </button>
  );
}
