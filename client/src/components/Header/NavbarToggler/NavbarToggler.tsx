"use client";

import { useNavbarContext } from "../Navbar/NavbarContext";
import styles from "./NavbarToggler.module.css";

export default function NavbarToggler() {
  const { toggleNavbar } = useNavbarContext();

  return (
    <div className={styles.navbarToggler} onClick={toggleNavbar}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
