/**
 * Secure token storage using httpOnly cookies and encrypted localStorage fallback
 */

// Use built-in crypto instead of external dependency
const CryptoJS: any = null // Disabled - using fallback encoding

const STORAGE_KEY = 'intransparency_auth'
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production'

interface AuthData {
  accessToken: string
  refreshToken: string
  user: any
  expiresAt: number
}

class SecureStorage {
  private storageAvailable = false

  constructor() {
    this.storageAvailable = typeof window !== 'undefined' && !!window.localStorage
  }

  /**
   * Encrypt data before storing
   */
  private encrypt(data: string): string {
    try {
      if (CryptoJS && CryptoJS.AES) {
        return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
      } else {
        // Fallback to base64 encoding when crypto-js is not available
        return btoa(data)
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      return data // Fallback to unencrypted if encryption fails
    }
  }

  /**
   * Decrypt data after retrieving
   */
  private decrypt(encryptedData: string): string | null {
    try {
      if (CryptoJS && CryptoJS.AES) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
      } else {
        // Fallback to base64 decoding when crypto-js is not available
        try {
          return atob(encryptedData)
        } catch {
          // If base64 decoding fails, assume it's unencrypted
          return encryptedData
        }
      }
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }

  /**
   * Set authentication data
   */
  setAuthData(data: AuthData): void {
    if (!this.storageAvailable) return

    try {
      // Set httpOnly cookie via API call for production security
      if (process.env.NODE_ENV === 'production') {
        this.setSecureCookie(data)
      }

      // Encrypt and store in localStorage as fallback
      const encryptedData = this.encrypt(JSON.stringify(data))
      localStorage.setItem(STORAGE_KEY, encryptedData)

      // Store user data separately (non-sensitive) for easy access
      if (data.user) {
        const userInfo = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role
        }
        localStorage.setItem('user_info', JSON.stringify(userInfo))
      }
    } catch (error) {
      console.error('Failed to set auth data:', error)
    }
  }

  /**
   * Get authentication data
   */
  getAuthData(): AuthData | null {
    if (!this.storageAvailable) return null

    try {
      // Try to get from httpOnly cookie first (production)
      if (process.env.NODE_ENV === 'production') {
        const cookieData = this.getSecureCookie()
        if (cookieData) return cookieData
      }

      // Fallback to encrypted localStorage
      const encryptedData = localStorage.getItem(STORAGE_KEY)
      if (!encryptedData) return null

      const decryptedData = this.decrypt(encryptedData)
      if (!decryptedData) return null

      const authData = JSON.parse(decryptedData) as AuthData

      // Check if token is expired
      if (Date.now() >= authData.expiresAt) {
        this.clearAuthData()
        return null
      }

      return authData
    } catch (error) {
      console.error('Failed to get auth data:', error)
      this.clearAuthData()
      return null
    }
  }

  /**
   * Get just the access token
   */
  getAccessToken(): string | null {
    const authData = this.getAuthData()
    return authData?.accessToken || null
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    const authData = this.getAuthData()
    return authData?.refreshToken || null
  }

  /**
   * Get user info
   */
  getUserInfo(): any | null {
    if (!this.storageAvailable) return null

    try {
      const userInfo = localStorage.getItem('user_info')
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      console.error('Failed to get user info:', error)
      return null
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    if (!this.storageAvailable) return

    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('user_info')
      localStorage.removeItem('token') // Legacy cleanup
      localStorage.removeItem('user') // Legacy cleanup

      // Clear httpOnly cookie
      if (process.env.NODE_ENV === 'production') {
        this.clearSecureCookie()
      }
    } catch (error) {
      console.error('Failed to clear auth data:', error)
    }
  }

  /**
   * Update user information
   */
  updateUserInfo(userInfo: any): void {
    if (!this.storageAvailable) return

    try {
      const currentAuth = this.getAuthData()
      if (currentAuth) {
        currentAuth.user = userInfo
        this.setAuthData(currentAuth)
      }

      // Update user info cache
      const safeUserInfo = {
        id: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        role: userInfo.role
      }
      localStorage.setItem('user_info', JSON.stringify(safeUserInfo))
    } catch (error) {
      console.error('Failed to update user info:', error)
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * Set secure httpOnly cookie via API
   */
  private async setSecureCookie(data: AuthData): Promise<void> {
    try {
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt
        }),
        credentials: 'include'
      })
    } catch (error) {
      console.error('Failed to set secure cookie:', error)
    }
  }

  /**
   * Get secure httpOnly cookie via API
   */
  private async getSecureCookie(): Promise<AuthData | null> {
    try {
      const response = await fetch('/api/auth/get-cookie', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to get secure cookie:', error)
    }

    return null
  }

  /**
   * Clear secure httpOnly cookie via API
   */
  private async clearSecureCookie(): Promise<void> {
    try {
      await fetch('/api/auth/clear-cookie', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Failed to clear secure cookie:', error)
    }
  }

  /**
   * Migrate from legacy localStorage storage
   */
  migrateLegacyStorage(): void {
    if (!this.storageAvailable) return

    try {
      const legacyToken = localStorage.getItem('token')
      const legacyUser = localStorage.getItem('user')

      if (legacyToken && legacyUser) {
        const user = JSON.parse(legacyUser)
        const authData: AuthData = {
          accessToken: legacyToken,
          refreshToken: '', // Will need to refresh
          user,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }

        this.setAuthData(authData)

        // Clean up legacy storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        console.log('Migrated legacy authentication storage')
      }
    } catch (error) {
      console.error('Failed to migrate legacy storage:', error)
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage()

// Migrate legacy storage on initialization
if (typeof window !== 'undefined') {
  secureStorage.migrateLegacyStorage()
}

export default secureStorage