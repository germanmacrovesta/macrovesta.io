import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export type WeglotLanguageSwitcherProps = {
  domain: string
  langs: { [key: string]: string }
}

/* global window */

/**
 * NextJS compatible Weglot Language Switcher (uses TailwindCSS)
 *
 * Usage:
 * <WeglotLanguageSwitcher
 *     domain="yourdomain.com"
 *     langs={{ www: 'EN', de: 'DE', fr: 'FR', es: 'ES' }} />
 * where key is the subdomain, and
 *     value is the name of the language you want to display
 */
export const WeglotLanguageSwitcher = ({
  domain,
  langs
}: WeglotLanguageSwitcherProps) => {
  const [hostname, setHostname] = useState('')
  const [pathAndQuery, setPathAndQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', setPathAndQuery)
    router.events.on('hashChangeComplete', setPathAndQuery)
    return () => {
      router.events.off('routeChangeComplete', setPathAndQuery)
      router.events.off('hashChangeComplete', setPathAndQuery)
    }
  }, [router, router.events])

  useEffect(() => {
    setHostname(window.location.hostname.toLowerCase())
    setPathAndQuery(window.location.pathname + window.location.hash)
  }, [])

  // In weglot add Excluded Block for ".custom-wg-languages"
  // In your own css hide original language switcher
  // via #weglot-switcher-1 { display: none; }
  return (
    <div
      className={
        'custom-wg-languages fixed left-0 bottom-0 z-50 ' +
        'flex flex-row gap-2 rounded-tr bg-white px-2'
      }
    >
      {Object.keys(langs).map((lang) => (
        <a
          key={lang}
          href={
            hostname.startsWith(lang)
              ? '#'
              : `https://${lang}.${domain}` + pathAndQuery
          }
          className={
            'block border-b-4  p-2 font-bold text-gray-600' +
            'hover:border-red-600 hover:text-black ' +
            (hostname.startsWith(lang)
              ? 'border-red-600'
              : 'border-transparent')
          }
        >
          {langs[lang]}
        </a>
      ))}
    </div>
  )
}
