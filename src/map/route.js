import { decodePolyline } from '../utils/polyline.js';

const VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route';

export class RouteManager {
  constructor(map) {
    this.map = map;
    this.waypoints = [];
    this.markers = [];
    this.routeLine = null;
    this.currentRoute = null;
    this.onUpdate = null;
  }

  addWaypoint(latlng) {
    const index = this.waypoints.length;
    const marker = L.marker(latlng, {
      draggable: true,
      icon: this._createIcon(index),
    }).addTo(this.map);

    marker.on('dragend', () => this._recalculate());
    marker.on('click', () => this.removeWaypoint(index));
    marker.on('contextmenu', () => this.removeWaypoint(index));

    this.waypoints.push(latlng);
    this.markers.push(marker);
    this._updateMarkerIcons();
    this._recalculate();
  }

  removeWaypoint(index) {
    if (index < 0 || index >= this.waypoints.length) return;
    this.map.removeLayer(this.markers[index]);
    this.waypoints.splice(index, 1);
    this.markers.splice(index, 1);
    this._updateMarkerIcons();
    this._recalculate();
  }

  clear() {
    this.waypoints.forEach((_, i) => {
      if (this.markers[i]) this.map.removeLayer(this.markers[i]);
    });
    if (this.routeLine) this.map.removeLayer(this.routeLine);
    this.waypoints = [];
    this.markers = [];
    this.routeLine = null;
    this.currentRoute = null;
    if (this.onUpdate) this.onUpdate(null);
  }

  getGeoJSON() {
    if (!this.currentRoute) return null;
    return {
      type: 'Feature',
      properties: {
        distance: this.currentRoute.distance,
        duration: this.currentRoute.duration,
      },
      geometry: this.currentRoute.geometry,
    };
  }

  getWaypoints() {
    return this.waypoints.map((ll, i) => ({
      lat: ll.lat,
      lng: ll.lng,
      type: i === 0 ? 'start' : i === this.waypoints.length - 1 ? 'end' : 'via',
    }));
  }

  _createIcon(index) {
    const color = index === 0 ? '#4CAF50' : '#2196F3';
    const label = index === 0 ? 'S' : String(index);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.85rem;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${label}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  _updateMarkerIcons() {
    this.markers.forEach((marker, i) => {
      marker.setIcon(this._createIcon(i));
    });
  }

  async _recalculate() {
    if (this.waypoints.length < 2) {
      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
        this.routeLine = null;
      }
      this.currentRoute = null;
      if (this.onUpdate) this.onUpdate(null);
      return;
    }

    // 위치 업데이트
    this.waypoints = this.markers.map(m => m.getLatLng());

    const body = {
      locations: this.waypoints.map(ll => ({ lat: ll.lat, lon: ll.lng })),
      costing: 'bicycle',
      directions_options: { units: 'kilometers' },
    };

    try {
      const res = await fetch(VALHALLA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.trip || !data.trip.legs || !data.trip.legs.length) {
        console.warn('Valhalla route failed', data);
        return;
      }
      const leg = data.trip.legs[0];
      const coords = decodePolyline(leg.shape);
      this.currentRoute = {
        distance: data.trip.summary.length * 1000, // km → m
        duration: data.trip.summary.time, // seconds
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };
      this._drawRoute(this.currentRoute.geometry);
      if (this.onUpdate) this.onUpdate(this.currentRoute);
    } catch (err) {
      console.error('Valhalla route error', err);
    }
  }

  _drawRoute(geometry) {
    if (this.routeLine) this.map.removeLayer(this.routeLine);
    this.routeLine = L.geoJSON(geometry, {
      style: { color: '#2196F3', weight: 5, opacity: 0.9 },
    }).addTo(this.map);
    this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
  }
}
