# Google Maps API Setup

To enable the real Google Maps integration in the Geographic Talent Search, you need to set up a Google Maps API key.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"

## 2. Enable Required APIs

Enable these APIs for your project:
- **Maps JavaScript API** (required for the map display)
- **Geocoding API** (optional, for address search)
- **Places API** (optional, for location search)

## 3. Create an API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key

## 4. Secure Your API Key (Recommended)

1. Click on your API key to edit it
2. Under "Application restrictions":
   - For development: Select "HTTP referrers" and add `http://localhost:3000/*`
   - For production: Add your domain `https://yourdomain.com/*`
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose the APIs you enabled above

## 5. Add to Your Environment

Add your API key to `/frontend/.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 6. Billing Setup

Google Maps requires a billing account for production use, but offers:
- **$200/month free credit** (covers most small to medium applications)
- **Pay-as-you-use** pricing after free credit

## 7. Current Features Using Real Google Maps

✅ **Real satellite/street/terrain imagery**
✅ **Interactive pan and zoom**
✅ **Real university locations with GPS coordinates**
✅ **Accurate distance calculations**
✅ **Professional map controls**
✅ **Radius search with real geodetic circles**
✅ **Distance measurement on real geography**
✅ **Custom university markers with talent data**

## Fallback

If no API key is provided, the component will show "Error loading Google Maps" - you can temporarily use `demo-key` for development testing, but it won't load real map data.

## Cost Estimate

For most applications:
- **Map loads**: ~1,000-10,000 per month = FREE (within $200 credit)
- **Typical usage**: Well within free tier for most businesses
- **Heavy usage**: ~$0.005 per map load after free credit

The geographic talent search is now a **real interactive mapping application**! 🗺️