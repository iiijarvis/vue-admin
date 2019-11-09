import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocale from './en'
// import zhCNLocale from './zh-CN'

Vue.use(VueI18n)

const messages = {
  // 'zh-CN': zhCNLocale,
  en: enLocale
}

const i18n = new VueI18n({
  locale: 'en',
  messages
})

function setI18nLanguage (lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguage (lang) {
  if (i18n.locale === lang) {
    return
  }
  import(`@/lang/${lang}`).then(msgs => {
    // console.log(msgs)
    i18n.setLocaleMessage(lang, msgs.default)
    setI18nLanguage(lang)
  }).catch(error => {
    console.error(error)
  })
}

export default i18n
