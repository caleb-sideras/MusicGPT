"use client";

import { AnchorHTMLAttributes, FC } from "react";
import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import Waveform from "../Icons/waveform";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";


interface ListItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  title: string;
  children: React.ReactNode;
  section?: string;
}

export const Navbar: FC = () => {
  const pathname = usePathname();

  const liteHighlighted = pathname?.startsWith('/lite');
  const proHighlighted = pathname?.startsWith('/pro');
  const homeHighlighted = !proHighlighted && !liteHighlighted ? true : false;

  return (

    <NavigationMenu.Root className="relative z-[1] flex w-full justify-center mt-4">
      <NavigationMenu.List className={`center m-0 h-[63px] flex list-none rounded-full
      ${liteHighlighted ? 'bg-secondary text-on-secondary' : proHighlighted ? 'bg-inverse-surface text-inverse-on-surface' : 'bg-tertiary text-on-tertiary'}`}>

        {/* Home */}
        <NavigationMenu.Item className="justify-center flex">
          <NavigationMenu.Link
            className={`group flex select-none items-center justify-center gap-[2px] rounded-full -ml-1 px-3 py-2 text-[15px] sm:w-36 w-24 font-medium leading-none outline-none
            ${homeHighlighted ? 'text-on-tertiary-container bg-tertiary-container' : 'text-on-tertiary'}`}
            href="/"
          >
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        {/* Lite */}
        <NavigationMenu.Item className="justify-center flex">
          <NavigationMenu.Trigger className={`group flex select-none items-center justify-center gap-[2px] rounded-full -ml-1 px-3 py-2 text-[15px] sm:w-36 w-24 font-medium leading-none outline-none
          ${liteHighlighted ? 'text-on-secondary-container bg-secondary-container' : ''}`}>
            Lite{' '}
            <CaretDownIcon
              className={`hidden group-hover:block relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180
              ${liteHighlighted ? 'text-on-surface-variant' : 'text-on-tertiary-variant'}`}
              aria-hidden
            />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="bg-secondary z-10 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
            <Link href="/lite">
              <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                <li className="row-span-3 grid">
                  <NavigationMenu.Link asChild>
                    <div
                      className="from-surface to-on-surface flex 
                    h-full w-full select-none flex-col justify-end rounded-[6px] bg-secondary-container p-[25px] no-underline outline-none"
                    >
                      <Waveform />
                      <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-on-secondary-container">
                        MusicGPT Lite
                      </div>
                      <p className="text-mauve4 text-[14px] leading-[1.3] text-on-secondary-container">
                        Musical, Lyrical & Cultural analysis.
                      </p>
                    </div>
                  </NavigationMenu.Link>
                </li>

                <ListItem href="/lite" title="Musical" section="lite">
                  Discuss high & low level features capturing the general structure of the music.
                </ListItem>
                <ListItem href="/lite" title="Lyrics" section="lite">
                  Understand the meaning behind lyrics.
                </ListItem>
                <ListItem href="/lite" title="Cultural" section="lite">
                  Be informed about the context surrounding the music and its relevance to various topics.
                </ListItem>
              </ul>
            </Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Pro */}
        <NavigationMenu.Item className="justify-center flex">
          <NavigationMenu.Trigger className={`group flex select-none items-center justify-center gap-[2px] rounded-full -ml-1 px-3 py-2 text-[15px] sm:w-36 w-24 font-medium leading-none outline-none
          ${proHighlighted ? 'text-inverse-surface bg-inverse-on-surface' : ''}`}>
            Pro{' '}
            <CaretDownIcon
              className={` hidden group-hover:block relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180
              ${proHighlighted ? 'text-on-surface-variant' : 'text-on-tertiary-variant'}`}
              aria-hidden
            />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute z-10 top-0 left-0 w-full sm:w-auto">
            <Link href="/pro">
              <ul className="one bg-inverse-surface m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-cols-[0.75fr_1fr]">
                <li className="row-span-4 grid">
                  <NavigationMenu.Link asChild>
                    <div
                      className=" flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-inverse-on-surface p-[25px] no-underline outline-none"
                    >
                      <Waveform />
                      <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-inverse-surface">
                        MusicGPT Pro
                      </div>
                      <p className="text-mauve4 text-[14px] leading-[1.3] text-inverse-surface">
                        Real-time, dedicated, technical analysis.
                      </p>
                    </div>
                  </NavigationMenu.Link>
                </li>
                <ListItem href="/pro" title="Production and Engineering">
                  Discuss technical aspects of songs such as stero image, compression and more.
                </ListItem>
                <ListItem href="/pro" title="MIDI">
                  Discuss a songs MIDI with MusicGPT&apos;s Polyphonic MIDI extraction.
                </ListItem>
                <ListItem href="/pro" title="Visualizations">
                  Describe a visualization and MusicGPT will create it.
                </ListItem>
                <ListItem href="/pro" title="Upload">
                  Upload your own music for analysis.
                </ListItem>
              </ul>
            </Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Github */}
        {/* <NavigationMenu.Item className="justify-center flex">
          <NavigationMenu.Link
            className="p-4 no-underline group flex select-none items-center justify-center gap-[2px] rounded-full px-3 py-2 text-[15px] sm:w-36 w-24 font-medium leading-none outline-none"
            href="https://github.com/caleb-sideras"
            target="_blank"
          >
            Github
          </NavigationMenu.Link>
        </NavigationMenu.Item> */}

        {/* Sign In */}
        <NavigationMenu.Item className="justify-center flex">
          <NavigationMenu.Link
            className={`group flex select-none items-center justify-center gap-[2px] rounded-full -ml-1 px-3 py-2 text-[15px] sm:w-36 w-24 font-medium leading-none outline-none`}>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="text-center data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-on-surface" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>


      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport className="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-white transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </NavigationMenu.Root>
  );
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(({ className, children, title, section = 'pro', ...props }, forwardedRef) => (
  <li>
    <NavigationMenu.Link asChild>
      <div
        className={
          `hover:bg-mauve3 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors ${className}`
        }
      >

        {section === 'lite' ?
          <>
            <div className="mb-[5px] font-medium leading-[1.2] text-on-secondary">{title}</div>
            <p className="text-mauve11 leading-[1.4] text-secondary-container">{children}</p>
          </>
          :
          <>
            <div className="mb-[5px] font-medium leading-[1.2] text-inverse-on-surface">{title}</div>
            <p className="text-mauve11 leading-[1.4] text-inverse-on-surface">{children}</p>
          </>}

      </div>
    </NavigationMenu.Link>
  </li>
));

ListItem.displayName = 'ListItem';
