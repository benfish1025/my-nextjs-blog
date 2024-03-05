import Link from 'next/link';

import Logo from './logo';
import classes from './main-navigation.module.css';

function MainNavigation() {
  return (
    <header className={classes.header}>
      <Link href='/'>
          <Logo />
      </Link>
    </header>
  );
}

export default MainNavigation;
