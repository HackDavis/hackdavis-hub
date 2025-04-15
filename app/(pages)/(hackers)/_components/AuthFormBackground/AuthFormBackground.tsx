"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Logo from "public/hackers/mvp/HDLogo.svg";
import grassAsset from "@public/hackers/mvp/grass_asset.svg";
import mascots from "@public/hackers/mvp/peeking_around_wall.svg";
import VocalAngelCow from "public/hackers/mvp/vocal_angel_cow.svg";
import styles from "./AuthFormBackground.module.scss";

export default function AuthFormBackground({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [mascotsVisibility, setMascotsVisibility] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/register/details") {
      setMascotsVisibility(false);
    } else {
      setMascotsVisibility(true);
    }
  }, [pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header_container}>
          <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
          <div className={styles.header}>
            <Image
              src={VocalAngelCow}
              alt="Angel Cow"
              height={100}
              width={100}
            />
            <div className={styles.header_text}>
              <h1>{title}</h1>
              <p style={{ whiteSpace: "pre-line" }}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div className={styles.overlayContent}>{children}</div>
      </div>

      <div className={styles.grass_asset}>
        <Image
          src={grassAsset}
          alt="grass asset"
          className={styles.grass}
          style={mascotsVisibility ? {} : { position: "relative" }}
        />
        {mascotsVisibility && (
          <Image src={mascots} alt="mascots" className={styles.mascots} />
        )}
      </div>
    </div>
  );
}
