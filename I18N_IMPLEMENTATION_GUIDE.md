# InTransparency - Complete i18n Implementation Guide

## ✅ What I've Installed & Configured

### 1. Package Installed
```bash
npm install next-intl
```

### 2. Files Created
- `/frontend/i18n.ts` - i18n configuration
- `/frontend/messages/it.json` - Italian translations (STARTED)
- `/frontend/messages/en.json` - English translations (NEEDED)

---

## 📋 Complete Implementation Steps

### **STEP 1: Complete Translation Files** ⚠️ PRIORITY

You need to create complete translation files for all content. I've started with the most critical sections in `it.json`:

**Already Translated:**
- Navigation (nav)
- Homepage (home)
- Footer (footer)
- Pricing (pricing - partial)

**Needed:**
- Features page
- How It Works page
- Success Stories page
- Explore page
- About page
- Contact page
- Dashboard pages
- All other pages

**How to Complete:**
1. Copy `it.json` structure
2. Create `en.json` with English translations
3. Add missing sections for all pages
4. Use nested structure: `page.section.subsection.key`

---

### **STEP 2: Update Next.js Configuration**

Update `next.config.js`:

```javascript
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
}

module.exports = withNextIntl(nextConfig)
```

---

### **STEP 3: Create Middleware for Locale Detection**

Create `middleware.ts` in the root:

```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // /it/pricing or just /pricing for Italian
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

---

### **STEP 4: Update App Structure**

Current structure:
```
app/
  page.tsx
  pricing/
    page.tsx
  features/
    page.tsx
```

New structure with i18n:
```
app/
  [locale]/
    page.tsx
    pricing/
      page.tsx
    features/
      page.tsx
    layout.tsx
```

**Migration Command:**
```bash
cd /mnt/c/Users/chefa/InTransparency/frontend
mkdir -p app/[locale]
mv app/*.tsx app/[locale]/
mv app/*/ app/[locale]/
# Keep api/, middleware, etc at root
```

---

### **STEP 5: Create Language Switcher Component**

`components/LanguageSwitcher.tsx`:

```typescript
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Button
        variant={locale === 'it' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('it')}
      >
        IT
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('en')}
      >
        EN
      </Button>
    </div>
  )
}
```

---

### **STEP 6: Update Header Component**

Add language switcher to `Header.tsx`:

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('nav')

  const navigation = [
    { name: t('features'), href: '/features' },
    { name: t('howItWorks'), href: '/how-it-works' },
    { name: t('explorePortfolios'), href: '/explore' },
    { name: t('successStories'), href: '/success-stories' },
    { name: t('demo'), href: '/demo/ai-search' },
    { name: t('pricing'), href: '/pricing' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' }
  ]

  return (
    <header>
      {/* ... existing code */}
      <LanguageSwitcher />
      {/* ... navigation */}
    </header>
  )
}
```

---

### **STEP 7: Update Page Components**

**Before:**
```typescript
export default function HomePage() {
  return (
    <div>
      <h1>Transform Your Academic Projects</h1>
      <p>Upload projects → Institution verifies → Companies discover YOU</p>
    </div>
  )
}
```

**After:**
```typescript
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home.hero')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  )
}
```

---

## 📁 Complete Translation File Structure

### Recommended Structure:

```json
{
  "nav": { ... },
  "footer": { ... },
  "home": {
    "hero": { ... },
    "problem": { ... },
    "howItWorks": { ... },
    "features": { ... },
    "stats": { ... },
    "cta": { ... }
  },
  "pricing": {
    "students": { ... },
    "companies": { ... },
    "institutes": { ... }
  },
  "features": {
    "hero": { ... },
    "verification": { ... },
    "aiAnalysis": { ... },
    // ... all features
  },
  "howItWorks": {
    "hero": { ... },
    "students": { ... },
    "institutes": { ... },
    "recruiters": { ... }
  },
  "about": { ... },
  "contact": { ... },
  "dashboard": {
    "student": { ... },
    "recruiter": { ... },
    "university": { ... }
  },
  "common": {
    "buttons": {
      "submit": "...",
      "cancel": "...",
      "save": "..."
    },
    "errors": { ... },
    "success": { ... }
  }
}
```

---

## 🚀 Quick Start Implementation

### For Immediate Italian Support:

1. **Create `en.json`** - Copy `it.json` and translate to English
2. **Update `next.config.js`** - Add next-intl plugin
3. **Create `middleware.ts`** - Add locale detection
4. **Restructure app/** - Move to `app/[locale]/`
5. **Add LanguageSwitcher** - In Header component
6. **Update components** - Use `useTranslations()` hook

---

## 📝 Translation Priority List

### Phase 1 - Critical (Do First):
1. Navigation/Header/Footer
2. Homepage
3. Pricing page
4. Features page
5. How It Works page

### Phase 2 - Important:
6. About page
7. Contact page
8. Success Stories
9. Explore page
10. Auth pages (login/register)

### Phase 3 - Dashboard:
11. Student dashboard
12. Recruiter dashboard
13. University dashboard
14. Settings pages

### Phase 4 - Remaining:
15. All other marketing pages
16. Error pages
17. Legal pages (Privacy, Terms)

---

## 🔧 Testing

### Test Checklist:
- [ ] Italian is default language
- [ ] EN/IT switcher works on all pages
- [ ] URLs preserve locale: `/it/pricing`, `/en/pricing`
- [ ] All text is translated (no hardcoded English)
- [ ] Forms submit in correct language
- [ ] Error messages in correct language
- [ ] Email notifications in correct language

---

## 📊 Translation Coverage Tracker

Create a spreadsheet to track translation progress:

| Page | IT Completed | EN Completed | Notes |
|------|--------------|--------------|-------|
| Homepage | ✅ | ⏳ | Hero done |
| Pricing | 🟡 50% | ⏳ | Students done |
| Features | ❌ | ❌ | Not started |
| ... | ... | ... | ... |

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot find module './messages/en.json'"
**Solution**: Create `en.json` file with complete translations

### Issue: "useTranslations is not defined"
**Solution**: Import from 'next-intl': `import { useTranslations } from 'next-intl'`

### Issue: Locale not detected
**Solution**: Check middleware.ts is in correct location and config matcher is set

### Issue: Mixed languages on page
**Solution**: Ensure ALL text uses `t()` function, no hardcoded strings

---

## 📞 Need Help?

This is a large migration. Consider:
1. Hiring Italian translator for quality
2. Using ChatGPT/Claude to batch translate sections
3. Having native Italian speaker review all translations
4. Testing with real Italian users

---

## ⏱️ Estimated Timeline

- **Setup infrastructure**: 2-4 hours
- **Create complete translations**: 16-24 hours
- **Migrate all pages**: 8-12 hours
- **Testing & bug fixes**: 4-8 hours
- **Total**: 30-48 hours

---

## 🎯 Next Immediate Steps

1. Create complete `en.json` translation file
2. Update `next.config.js`
3. Create `middleware.ts`
4. Restructure app directory
5. Test with one page (start with homepage)
6. Gradually migrate all pages

**Questions?** Check next-intl docs: https://next-intl-docs.vercel.app/
