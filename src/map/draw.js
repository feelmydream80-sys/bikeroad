import { decodePolyline } from '../utils/polyline.js';

const VALHALLA_TRACE_URL = 'https://valhalla1.openstreetmap.de/trace_route';

export class DrawManager {
  constructor(map) {
    this.map = map;
    this.drawing = false;
    this.drawCoords = [];
    this.drawPolyline = null;
    this.matchedLine = null;
    this.currentRoute = null;
    this.onUpdate = null;
    this.preventNextClick = false;
    this.lastEndPoint = null;
    this._setupEvents();
  }

  consumeClick() {
    const val = this.preventNextClick;
    this.preventNextClick = false;
    return val;
  }

  _setupEvents() {
    this.map.on('mousedown', (e) => {
      if (!this._isDrawModeActive()) return;
      this.map.getContainer().style.cursor = 'crosshair';

      let startCoords;
      if (this.lastEndPoint && this.currentRoute) {
        const lastPt = this.lastEndPoint;
        const dist = Math.sqrt(
          Math.pow(e.latlng.lat - lastPt[0], 2) +
          Math.pow(e.latlng.lng - lastPt[1], 2)
        );
        if (dist < 0.0005) {
          startCoords = [lastPt[0], lastPt[1]];
        } else {
          startCoords = [e.latlng.lat, e.latlng.lng];
        }
      } else {
        startCoords = [e.latlng.lat, e.latlng.lng];
      }

      this.drawing = true;
      this.drawCoords = [startCoords];
      this._updateDrawLine();
    });

    this.map.on('mousemove', (e) => {
      if (!this.drawing) return;
      this.drawCoords.push([e.latlng.lat, e.latlng.lng]);
      this._updateDrawLine();
    });

    this.map.on('mouseup', () => {
      if (!this.drawing) return;
      this.drawing = false;
      this.map.getContainer().style.cursor = 'crosshair';
      this.preventNextClick = true;
      this._matchRoute();
    });

    // 터치 이벤트
    this.map.on('touchstart', (e) => {
      if (!this._isDrawModeActive()) return;
      const latlng = e.latlng || e.touches?.[0] ? this.map.mouseEventToLatLng(e.touches[0]) : null;
      if (!latlng) return;

      let startCoords;
      if (this.lastEndPoint && this.currentRoute) {
        const lastPt = this.lastEndPoint;
        const dist = Math.sqrt(
          Math.pow(latlng.lat - lastPt[0], 2) +
          Math.pow(latlng.lng - lastPt[1], 2)
        );
        if (dist < 0.0005) {
          startCoords = [lastPt[0], lastPt[1]];
        } else {
          startCoords = [latlng.lat, latlng.lng];
        }
      } else {
        startCoords = [latlng.lat, latlng.lng];
      }

      this.drawing = true;
      this.drawCoords = [startCoords];
      this._updateDrawLine();
    });

    this.map.on('touchmove', (e) => {
      if (!this.drawing) return;
      const latlng = e.latlng || (e.touches?.[0] ? this.map.mouseEventToLatLng(e.touches[0]) : null);
      if (!latlng) return;
      this.drawCoords.push([latlng.lat, latlng.lng]);
      this._updateDrawLine();
    });

    this.map.on('touchend', () => {
      if (!this.drawing) return;
      this.drawing = false;
      this.preventNextClick = true;
      this._matchRoute();
    });
  }

  _isDrawModeActive() {
    return document.querySelector('[data-mode="draw"]').classList.contains('active');
  }

  _updateDrawLine() {
    if (this.drawPolyline) this.map.removeLayer(this.drawPolyline);
    if (this.drawCoords.length < 2) return;
    this.drawPolyline = L.polyline(this.drawCoords, {
      color: '#999',
      weight: 4,
      opacity: 0.5,
      dashArray: '8, 8',
    }).addTo(this.map);
  }

  async _matchRoute() {
    if (this.drawCoords.length < 3) return;
    const sampled = this._sampleCoords(this.drawCoords, 200);
    const shape = sampled.map(c => ({ lat: c[0], lon: c[1] }));

    const body = {
      shape,
      costing: 'bicycle',
      shape_match: 'map_snap',
      directions_options: { units: 'kilometers' },
    };

    try {
      const res = await fetch(VALHALLA_TRACE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.trip || !data.trip.legs || !data.trip.legs.length) {
        console.warn('Valhalla trace failed', data);
        this._fallbackLine();
        return;
      }
      const leg = data.trip.legs[0];
      const coords = decodePolyline(leg.shape);
      this.currentRoute = {
        distance: data.trip.summary.length * 1000,
        duration: data.trip.summary.time,
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };
      this._drawMatched(this.currentRoute.geometry);
      if (this.onUpdate) this.onUpdate(this.currentRoute);
    } catch (err) {
      console.error('Valhalla trace error', err);
      this._fallbackLine();
    }
  }

  _fallbackLine() {
    if (this.matchedLine) this.map.removeLayer(this.matchedLine);
    this.matchedLine = L.polyline(this.drawCoords, {
      color: '#ff9800',
      weight: 4,
      opacity: 0.8,
    }).addTo(this.map);
    this.currentRoute = {
      distance: 0,
      duration: 0,
      geometry: {
        type: 'LineString',
        coordinates: this.drawCoords.map(c => [c[1], c[0]]),
      },
    };
    if (this.onUpdate) this.onUpdate(this.currentRoute);
  }

  _drawMatched(geometry) {
    if (this.matchedLine) this.map.removeLayer(this.matchedLine);
    this.matchedLine = L.geoJSON(geometry, {
      style: { color: '#2196F3', weight: 5, opacity: 0.9 },
    }).addTo(this.map);
    if (this.drawPolyline) {
      this.map.removeLayer(this.drawPolyline);
      this.drawPolyline = null;
    }
    this.map.fitBounds(this.matchedLine.getBounds(), { padding: [50, 50] });

    const coords = geometry.coordinates;
    this.lastEndPoint = [coords[coords.length - 1][1], coords[coords.length - 1][0]];
  }

  _sampleCoords(coords, max) {
    if (coords.length <= max) return coords;
    const step = Math.ceil(coords.length / max);
    const result = [];
    for (let i = 0; i < coords.length; i += step) {
      result.push(coords[i]);
    }
    if (result[result.length - 1] !== coords[coords.length - 1]) {
      result.push(coords[coords.length - 1]);
    }
    return result;
  }

  clear() {
    if (this.drawPolyline) {
      this.map.removeLayer(this.drawPolyline);
      this.drawPolyline = null;
    }
    if (this.matchedLine) {
      this.map.removeLayer(this.matchedLine);
      this.matchedLine = null;
    }
    this.drawCoords = [];
    this.currentRoute = null;
    this.lastEndPoint = null;
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
    return [];
  }
}
