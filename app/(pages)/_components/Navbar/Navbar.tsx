'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import LogoutAction from '@actions/auth/logout';

import Link from 'next/link';
import Logo from './Logo';

import styles from './Navbar.module.scss';

interface NavLink {
  ids: string[];
  body: React.ReactNode;
  page: string;
  path: string;
  action?: () => void;
}

// todo: change hamburger menu color in mobile
// todo: fix logout button around 400px
const sections = [
  {
    id: 'home',
    page: '/',
    baseColor: '#1589BE',
    activeColor: '#005271',
    background: 'rgba(255, 255, 255, 0.50)',
  },
  {
    id: 'schedule',
    page: '/schedule',
    baseColor: '#1589BE',
    activeColor: '#FFC53D',
    background: 'rgba(255, 255, 255, 0.50)',
  },
  {
    id: 'project-info',
    page: '/project-info',
    baseColor: '#1589BE',
    activeColor: '#FFC53D',
    background: 'rgba(255, 255, 255, 0.50)',
  },
  // {
  //   id: 'starter-kit',
  //   page: '/starter-kit',
  //   baseColor: '#1589BE',
  //   activeColor: '#AFD157',
  //   background: 'rgba(255, 255, 255, 0.50)',
  // },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const [activeLink, setActiveLink] = useState(
    section || (pathname === '/' ? 'home' : 'about')
  );
  const [activeSection, setActiveSection] = useState(
    section || (pathname === '/' ? 'home' : 'about')
  );
  const [showNavbar, setShowNavbar] = useState(false);

  const handleLogout = async () => {
    const response = await LogoutAction();

    if (response.ok) {
      router.push('/login');
    }
  };

  const links = [
    {
      ids: ['schedule'],
      body: 'SCHEDULE',
      page: '/schedule',
      path: '/schedule',
    },
    // {
    //   ids: ['starter-kit'],
    //   body: 'STARTER KIT',
    //   page: '/starter-kit',
    //   path: '/starter-kit',
    // },
    {
      ids: [],
      body: 'PROJECT INFO',
      page: '/project-info',
      path: '/project-info',
    },
    {
      ids: [],
      body: 'LOGOUT',
      page: '/',
      path: '/logout',
      action: handleLogout,
    },
  ] as NavLink[];

  useEffect(() => {
    const updateActiveSection = () => {
      const currScroll = window.scrollY + window.innerHeight * 0.2;
      const pageSections = sections
        .filter((section) => section.page === pathname)
        .map((section) => {
          const sectionContainer = document.getElementById(section.id);
          if (!sectionContainer) {
            return { id: '', sectionStart: 0, sectionEnd: 0 };
          }
          const { offsetHeight } = sectionContainer;
          const rect = sectionContainer.getBoundingClientRect();
          return {
            id: section.id,
            sectionStart: rect.top + window.scrollY,
            sectionEnd: rect.top + window.scrollY + offsetHeight,
          };
        })
        .sort((a, b) => a.sectionStart - b.sectionStart)
        .filter(
          (section) => section.sectionStart !== 0 || section.sectionEnd !== 0
        );

      // added
      if (pageSections.length === 0) {
        setActiveLink('');
        setActiveSection('');
        return;
      }

      let i = pageSections.length - 1;
      for (i; i >= 0; i--) {
        if (currScroll >= pageSections[i].sectionStart) {
          break;
        }
      }

      i = i < 0 ? 0 : i;

      setActiveLink(
        currScroll > pageSections[i].sectionEnd ? '' : pageSections[i].id
      );

      setActiveSection(
        currScroll > pageSections[i].sectionEnd ? '' : pageSections[i].id
      );
    };

    const handleScroll = () => updateActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });

    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const currentSection = section;
    const sectionContainer = document.getElementById(currentSection as string);
    if (sectionContainer) {
      sectionContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section, pathname]);

  const getClickHandler = (link: NavLink) => {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (link.action) {
        link.action();
      } else {
        router.push(link.path, { scroll: false });
      }
      setShowNavbar(false);
    };
  };

  const getLogoColor = () => {
    // const currentSection = sections.find(
    //   (section) => activeSection === section.id
    // );
    // if (!currentSection) return '#005271';
    return '#005271';

    // return currentSection.activeColor;
  };

  const getLinkColor = (link: NavLink) => {
    const currentSection = sections.find(
      (section) => activeSection === section.id
    );
    if (!currentSection) return 'var(--text-light)';

    if (link.ids.find((id) => activeLink === id))
      return currentSection.activeColor;
    return currentSection.baseColor;
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.navigation} ${showNavbar ? styles.visible : null}`}
        style={{
          background:
            sections.find((section) => activeSection === section.id)
              ?.background ?? 'rgba(136, 136, 136, 0.50)',
        }}
      >
        <Link
          href="/"
          className={styles.logo}
          style={{ color: getLogoColor() }}
        >
          <Logo />
        </Link>
        <div className={styles.links}>
          {links.map((link) => (
            <Link
              className={`${styles.link} ${
                link.ids.find((id) => activeLink === id) ? styles.active : null
              }`}
              style={{
                color: getLinkColor(link),
              }}
              key={link.path}
              href={link.path}
              onClick={getClickHandler(link)}
            >
              {link.body}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.items}>
        <div className={styles.menu} onClick={() => setShowNavbar(!showNavbar)}>
          <div
            className={`${
              showNavbar ? styles.hamburger_active : styles.hamburger
            }`}
          >
            <span
              className={styles.hamburger_line}
              style={{ backgroundColor: getLogoColor() }}
            ></span>
            <span
              className={styles.hamburger_line}
              style={{ backgroundColor: getLogoColor() }}
            ></span>
            <span
              className={styles.hamburger_line}
              style={{ backgroundColor: getLogoColor() }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}
