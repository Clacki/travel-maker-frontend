/* eslint-disable @typescript-eslint/no-explicit-any */

interface Window {
  kakao: {
    maps: {
      load: (callback: () => void) => void
      Map: new (container: HTMLElement, options: any) => any
      LatLng: new (lat: number, lng: number) => any
      Marker: new (options: any) => any
      CustomOverlay: new (options: any) => any
      Polyline: new (options: any) => any
      LatLngBounds: new () => any
      event: {
        addListener: (target: any, type: string, handler: any) => void
      }
      services: {
        Places: new () => any
        Geocoder: new () => {
          coord2Address: (
            lng: number,
            lat: number,
            callback: (result: any, status: string) => void
          ) => void
        }
        Status: { OK: string }
      }
    }
  }
}
