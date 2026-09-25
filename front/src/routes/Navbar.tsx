import React from "react";
import styles from "./Navbar.module.css";
import { Link, Outlet } from "react-router";
import { Sun, Moon } from "lucide-react";
import { Search } from "lucide-react";
import { UAS, UAD } from "../global/Hooks";
import { toggleTheme } from "../global/ThemeSlice";
import { Login } from "../containers/log/Login";
import { AuthAPI } from "../global/AuthAPI";
import LOGO from "@public/Library1.png";

export const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const loginButton = React.useRef<HTMLButtonElement>(null);
    const menuButton = React.useRef<HTMLButtonElement>(null);
    const profileLink = React.useRef<HTMLAnchorElement>(null);
    const { data: session, error: sessionError } = AuthAPI.useProfileQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const sessionExpired = sessionError && "status" in sessionError && sessionError.status === 401;
    const currentUser = sessionExpired ? undefined : session?.data;
    const closeLogin = React.useCallback(() => {
        setLogin(false);
        requestAnimationFrame(() => {
            const target = menuButton.current?.offsetParent
                ? menuButton.current : loginButton.current ?? profileLink.current;
            target?.focus();
        });
    }, []);
    const dispatch = UAD();
    const mode = UAS((state) => state.theme.mode);
    const handleClick = () => setOpen(!open);
    const closemenu = () => setOpen(false);

    return (
        <React.Fragment>
            <header className={styles.nav__header}>
                <nav className={styles.nav}>
                    <Link
                        to={"/"}
                        className={styles.nav__logo}
                    >
                        <img 
                            alt="Library"
                            src={LOGO}
                            className={styles.nav__img} 
                        />
                    </Link>

                    {/* THEME TOGGLE */}
                    <button
                        className={styles.nav__theme}
                        type="button"
                        aria-label={mode === "dark"
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                        }
                        title={mode === "dark"
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                        }
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {mode === "dark" ? (
                            <Sun className={styles.nav__icon} />
                        ) : (
                            <Moon className={styles.nav__icon} />
                        )}
                    </button>

                    {/* NAV MENU BUTTON */}
                    <button
                        ref={menuButton}
                        className={styles.nav__button}
                        type="button"
                        aria-label="toggle"
                        aria-expanded={open}
                        onClick={handleClick}
                    >
                        <aside className={`
                            ${styles.nav__burger}
                            ${open ? styles.open : ""}
                        `}>
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                        </aside>
                    </button>

                    {/* SIDEBAR AND CONTAINER QUERIES */}
                    <menu className={open ? 
                        `${styles.nav__menu} ${styles.active}`
                        : `${styles.nav__menu}`
                    }>
                        <li className={styles.nav__item}>
                        {currentUser ? (
                            <Link ref={profileLink} to={`/profile/${currentUser.id}`}
                                className={styles.nav__links} onClick={closemenu}>
                                My profile
                            </Link>
                        ) : <button
                            ref={loginButton}
                            type="button"
                            className={styles.nav__links}
                            aria-haspopup="dialog"
                            onClick={() => {
                                closemenu();
                                setLogin(true);
                            }}
                        >
                            Login
                        </button>}
                        </li>

                        <li className={styles.nav__item}>
                            <Link
                                to={"/catalog"}
                                className={styles.nav__links}
                                onClick={closemenu}
                            >
                                Catalog
                            </Link>
                        </li>

                        {/* SEARCH BOX */}
                        <form className={styles.search}>
                            <input 
                                type="text" 
                                name="q"
                                placeholder="Search" 
                                aria-label="Search"
                            />
                            <button 
                                type="submit" 
                                aria-label="Submit catalog search"
                            >
                                <Search aria-hidden="true" />
                            </button>
                        </form>
                    </menu>
                </nav>
            </header>
            <Outlet />
            {login && (
                <Login onClose={closeLogin} />
            )}
        </React.Fragment>
    );
};



