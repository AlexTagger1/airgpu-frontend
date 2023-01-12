export const environment = {
  production: true,

  auth0: {
    domain: 'airgpu.eu.auth0.com',
    clientId: 'BUq6S9BnXWpDOrZxSHAOxqjpX0usFYS3',
    audience: 'https://api.airgpu.com'
  },
  general: {
    appName: 'airgpu',
    termsUrl: 'https://airgpu.com/terms',
    privacyPolicyUrl: 'https://airgpu.com/privacy',
    cookiePolicyUrl: 'https://airgpu.com/cookies',
    copyrightHolderName: 'airgpu',
  },
  backend: {
    apiBaseUrl: 'https://api.airgpu.com',
    stackprintBaseUrl: 'https://apis.stackprint.io/airgpu'
  },
  paddle: {
    vendorId: 126869,
    products: {
      10: 745053,
      25: 745057,
      50: 745058
    },
    sandboxMode: false
  },
  hcaptcha: {
    siteKey: 'c74568db-f282-4c89-b66e-6dc6db01b1d3'
  },
  features: {
    buyCredits: true,
    multipleMachines: true
  }
};
