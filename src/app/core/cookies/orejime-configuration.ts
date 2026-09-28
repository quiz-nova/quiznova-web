import { WindowService } from '@Core/services/window.service';

export const ANONYMOUS_STORAGE_NAME_OREJIME = 'orejime-anonymous';

export const GOOGLE_ANALYTICS_OREJIME_KEY = 'google-analytics';

export const CORRELATION_ID_OREJIME_KEY = 'correlation-id';

export const CORRELATION_ID_COOKIE = 'CORRELATION-ID';

export const ACCESSTOKEN_COOKIE = 'ACCESS-TOKEN';

export function getOrejimeConfiguration(windowRef: WindowService): any {
  const _window = windowRef.nativeWindow as any;
  return {
    cookieName: ANONYMOUS_STORAGE_NAME_OREJIME,

    privacyPolicy: './info/privacy',

    cookieExpiresAfterDays: 365,

    lang: 'en',

    appElement: 'qn-app',

    stringifyCookie: (contents: any) => {
      return typeof contents === 'string' ? contents : JSON.stringify(contents);
    },

    parseCookie: (cookie: string) => {
      if (typeof cookie === 'string') {
        cookie = decodeURIComponent(cookie);
        return JSON.parse(cookie);
      }
      return cookie;
    },

    translations: {
      zz: {
        acceptAll: 'cookies.consent.accept-all',
        acceptSelected: 'cookies.consent.accept-selected',
        close: 'cookies.consent.close',
        consentModal: {
          title: 'cookies.consent.content-modal.title',
          description: 'cookies.consent.content-modal.description',
          privacyPolicy: {
            name: 'cookies.consent.content-modal.privacy-policy.name',
            text: 'cookies.consent.content-modal.privacy-policy.text',
          },
        },
        consentNotice: {
          changeDescription: 'cookies.consent.update',
          description: 'cookies.consent.content-notice.description',
          learnMore: 'cookies.consent.content-notice.learnMore',
        },
        decline: 'cookies.consent.decline',
        declineAll: 'cookies.consent.decline-all',
        accept: 'cookies.consent.ok',
        save: 'cookies.consent.save',
        purposes: {},
        app: {
          optOut: {
            description: 'cookies.consent.app.opt-out.description',
            title: 'cookies.consent.app.opt-out.title',
          },
          purpose: 'cookies.consent.app.purpose',
          purposes: 'cookies.consent.app.purposes',
          required: {
            title: 'cookies.consent.app.required.title',
            description: 'cookies.consent.app.required.description',
          },
        },
      },
    },
    apps: [
      {
        name: 'authentication',
        purposes: ['functional'],
        required: true,
        optOut: true,
        cookies: [],
      },
      {
        name: CORRELATION_ID_OREJIME_KEY,
        purposes: ['statistical'],
        required: false,
        cookies: [CORRELATION_ID_COOKIE],
        callback: () => {
          _window?.nativeWindow?.initCorrelationId();
        },
      },
      {
        name: GOOGLE_ANALYTICS_OREJIME_KEY,
        purposes: ['statistical'],
        required: false,
        cookies: [[/^_ga.?$/], [/^_gid$/]],
        onlyOnce: true,
      },
    ],
  };
}
