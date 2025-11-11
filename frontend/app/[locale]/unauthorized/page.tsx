"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { FaLock, FaHome, FaArrowLeft } from "react-icons/fa"

export default function UnauthorizedPage() {
  const router = useRouter()
  const t = useTranslations("errors")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full">
            <FaLock className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("accessDenied")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {t("unauthorizedMessage")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            {t("goBack")}
          </Button>

          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <FaHome className="w-4 h-4" />
              {t("goHome")}
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
            {t("whyAmISeeingThis")}
          </h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
            <li>• {t("reasonInsufficientPermissions")}</li>
            <li>• {t("reasonWrongAccountType")}</li>
            <li>• {t("reasonSubscriptionRequired")}</li>
          </ul>
        </div>

        {/* Contact Support */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          {t("needHelp")}{" "}
          <Link
            href="/contact"
            className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
          >
            {t("contactSupport")}
          </Link>
        </p>
      </div>
    </div>
  )
}
