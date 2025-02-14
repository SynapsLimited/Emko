// src/components/PrivacyPolicy.jsx
import React from 'react';
import './../css/privacypolicy.css';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className="privacy-policy-container container">
      <Helmet>
        <title>{t('privacyPolicy.title')}</title>
        <meta name="description" content="Read Emko's Privacy Policy to learn how we protect your personal data and respect your privacy." />
        <meta property="og:title" content={t('privacyPolicy.title')} />
        <meta property="og:description" content="Read Emko's Privacy Policy to learn how we protect your personal data and respect your privacy." />
        <meta property="og:image" content="https://www.emko-client.vercel.app/assets/emko-logo.png" />
        <meta property="og:url" content="https://www.emko-client.vercel.app/privacy-policy" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.emko-client.vercel.app/privacy-policy" />
      </Helmet>

      <h1>{t('privacyPolicy.title')}</h1>

      <section>
        <h2>{t('privacyPolicy.introductionTitle')}</h2>
        <p>{t('privacyPolicy.introductionText')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.informationWeCollectTitle')}</h2>
        <p>{t('privacyPolicy.informationWeCollectText')}</p>
        <ul>
          <li><strong>{t('privacyPolicy.personalData')}</strong></li>
          <li><strong>{t('privacyPolicy.usageData')}</strong></li>
          <li><strong>{t('privacyPolicy.cookies')}</strong></li>
          <li><strong>{t('privacyPolicy.marketingData')}</strong></li>
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.howWeUseTitle')}</h2>
        <p>{t('privacyPolicy.howWeUseText')}</p>
        <ul>
          <li><strong>{t('privacyPolicy.toProvideService')}</strong></li>
          <li><strong>{t('privacyPolicy.toImproveService')}</strong></li>
          <li><strong>{t('privacyPolicy.toCommunicate')}</strong></li>
          <li><strong>{t('privacyPolicy.toProcessTransactions')}</strong></li>
          <li><strong>{t('privacyPolicy.toEnsureSecurity')}</strong></li>
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.informationSharingTitle')}</h2>
        <p>{t('privacyPolicy.informationSharingText')}</p>
        <ul>
          <li><strong>{t('privacyPolicy.withServiceProviders')}</strong></li>
          <li><strong>{t('privacyPolicy.forLegalRequirements')}</strong></li>
          <li><strong>{t('privacyPolicy.businessTransfers')}</strong></li>
          <li><strong>{t('privacyPolicy.withConsent')}</strong></li>
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.cookiesTitle')}</h2>
        <p>{t('privacyPolicy.cookiesText')}</p>
        <p>{t('privacyPolicy.cookiesText')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.dataSecurityTitle')}</h2>
        <p>{t('privacyPolicy.dataSecurityText')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.yourRightsTitle')}</h2>
        <p>{t('privacyPolicy.yourRightsText')}</p>
        <ul>
          <li>{t('privacyPolicy.access')}</li>
          <li>{t('privacyPolicy.rectification')}</li>
          <li>{t('privacyPolicy.erasure')}</li>
          <li>{t('privacyPolicy.restriction')}</li>
          <li>{t('privacyPolicy.portability')}</li>
          <li>{t('privacyPolicy.objection')}</li>
        </ul>
        <p>{t('privacyPolicy.contactUsText')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.changesTitle')}</h2>
        <p>{t('privacyPolicy.changesText')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.contactUsTitle')}</h2>
        <p>{t('privacyPolicy.contactUsText')}</p>
        <ul>
          <li><b>{t('privacyPolicy.email')}</b></li>
          <li><b>{t('privacyPolicy.address')}</b></li>
          <li><b>{t('privacyPolicy.phone')}</b></li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
