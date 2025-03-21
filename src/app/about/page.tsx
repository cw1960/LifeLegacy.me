'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-provider";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">LifeLegacy.me</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <nav>
              <ul className="flex space-x-6 items-center">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {t('nav.features')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {t('nav.pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    {t('nav.getStarted')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              {t('about.title')}
            </h2>
            <div className="prose prose-lg mx-auto">
              <p>
                {t('about.introduction')}
              </p>
              <p>
                {t('about.mission')}
              </p>
              <p>
                {t('about.vision')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 