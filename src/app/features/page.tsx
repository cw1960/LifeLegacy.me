'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-provider";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function FeaturesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container-lg py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">LifeLegacy.me</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <nav>
              <ul className="flex space-x-6 items-center">
                <li>
                  <Link
                    href="/features"
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {t('nav.features')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {t('nav.pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary"
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
        <section className="py-20 md:py-24 bg-white">
          <div className="container-lg">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-slate-900 mb-6">
                {t('features.title')}
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.documentManagement.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.documentManagement.description')}</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.digitalAssets.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.digitalAssets.description')}</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.beneficiaries.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.beneficiaries.description')}</p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.security.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.security.description')}</p>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.notifications.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.notifications.description')}</p>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-slate-100">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-slate-900">{t('features.planning.title')}</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-slate-600">{t('features.planning.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-primary-600 text-white">
          <div className="container-md text-center">
            <h2 className="text-white mb-6 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of clients who have simplified their estate planning process
              and gained peace of mind for their families.
            </p>
            <Link href="/auth/register" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg shadow-sm hover:shadow-md transition-all">
              Create Your Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} 