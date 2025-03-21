'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-provider";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function PricingPage() {
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
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {t('nav.features')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-primary-600 hover:text-primary-800 font-medium"
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
                {t('pricing.title')}
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {t('pricing.subtitle')}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Basic Plan */}
              <div className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border border-slate-100">
                <div className="px-8 py-8 bg-slate-50">
                  <h3 className="text-xl font-semibold text-slate-900">{t('pricing.basic.title')}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">${t('pricing.basic.price')}</span>
                    <span className="ml-1 text-xl text-slate-500">/{t('pricing.monthly')}</span>
                  </div>
                </div>
                <div className="px-8 pt-8 pb-8">
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.basic.feature1')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.basic.feature2')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.basic.feature3')}</p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <a href="#" className="btn btn-outline block w-full">
                      {t('pricing.getStarted')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden bg-white border-2 border-primary-500 transform scale-105">
                <div className="px-8 py-8 bg-primary-50">
                  <h3 className="text-xl font-semibold text-slate-900">{t('pricing.professional.title')}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">${t('pricing.professional.price')}</span>
                    <span className="ml-1 text-xl text-slate-500">/{t('pricing.monthly')}</span>
                  </div>
                </div>
                <div className="px-8 pt-8 pb-8">
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.professional.feature1')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.professional.feature2')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.professional.feature3')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.professional.feature4')}</p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <a href="#" className="btn btn-primary block w-full">
                      {t('pricing.getStarted')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border border-slate-100">
                <div className="px-8 py-8 bg-slate-50">
                  <h3 className="text-xl font-semibold text-slate-900">{t('pricing.enterprise.title')}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">{t('pricing.enterprise.price')}</span>
                  </div>
                </div>
                <div className="px-8 pt-8 pb-8">
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.enterprise.feature1')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.enterprise.feature2')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.enterprise.feature3')}</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-slate-700">{t('pricing.enterprise.feature4')}</p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <a href="#" className="btn btn-outline btn-slate block w-full">
                      {t('pricing.contactSales')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary-600 text-white">
          <div className="container-md text-center">
            <h2 className="text-white mb-6 text-3xl font-bold">Start Your Estate Planning Today</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Protect your legacy and provide peace of mind for your loved ones.
            </p>
            <Link href="/auth/register" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg shadow-sm hover:shadow-md transition-all">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} 