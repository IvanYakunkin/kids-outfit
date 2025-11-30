"use client";

import { Divide as Hamburger } from "hamburger-react";
import { useNavbarContext } from "../Navbar/NavbarContext";
import styles from "./NavbarToggler.module.css";

export default function NavbarToggler() {
  const { toggleNavbar, closeNavbar, isOpen } = useNavbarContext();

  const navbarTogglerClick = () => {
    if (isOpen) {
      closeNavbar();
    } else {
      toggleNavbar();
    }
  };

  return (
    <div
      className={styles.navbarToggler}
      id={"headerMenuTogglerBtn"}
      onClick={navbarTogglerClick}
    >
      <Hamburger rounded={true} toggled={isOpen} />
    </div>
  );
}
