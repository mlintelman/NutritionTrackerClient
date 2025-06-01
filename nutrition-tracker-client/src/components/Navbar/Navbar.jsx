import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import logo from '../../assets/logo.png'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <NavLink to="/home" className={styles.siteTitle}>
                <img src={logo} className={styles.logo} alt="Logo" />
            </NavLink>
            <ul>
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/logmeal"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        Log Meal
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/summary"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        Summary
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}