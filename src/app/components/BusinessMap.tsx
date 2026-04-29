import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Business } from '../data/businessData';
import { getLeadStatusMeta } from '../utils/leadWorkflow';
import { motion } from 'motion/react';

interface BusinessMapProps {
  businesses: Business[];
  searchQuery: string;
  onSelectBusiness: (business: Business) => void;
}

export function BusinessMap({ businesses, searchQuery, onSelectBusiness }: BusinessMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<any>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Gastronomia': '#EA580C',
      'Educacion y cultura': '#2563EB',
      'Salud': '#10B981',
      'Comercio': '#7C3AED',
      'Belleza y cuidado': '#EC4899',
      'Turismo y hospedaje': '#0891B2',
      'Automotriz': '#475569',
      'Servicios profesionales': '#0F766E',
      'Tecnologia y comunicaciones': '#0284C7'
    };
    return colors[category] || '#6B7280';
  };

  const createMarkerIcon = (business: Business) => {
    const statusMeta = getLeadStatusMeta(business.estadoId);
    const categoryColor = getCategoryColor(business.categoryGroup);
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="40">
        <path fill="${categoryColor}" d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        <circle fill="white" cx="12" cy="10" r="1.5"/>
      </svg>
    `;

    const icon = L.divIcon({
      html: svg,
      className: 'business-marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });

    return icon;
  };

  const createPopupContent = (business: Business) => {
    const statusMeta = getLeadStatusMeta(business.estadoId);
    const hasPhone = business.phone ? `<a href="tel:${business.phone}" class="text-blue-600 hover:underline">${business.phone}</a>` : 'N/A';
    const hasEmail = business.emails?.[0] ? `<a href="mailto:${business.emails[0]}" class="text-blue-600 hover:underline">${business.emails[0]}</a>` : 'N/A';

    return `
      <div style="width: 280px; font-family: system-ui; font-size: 13px;">
        <div style="margin-bottom: 8px;">
          <strong style="font-size: 14px; color: #1f2937;">${business.name}</strong>
        </div>
        <div style="margin-bottom: 6px;">
          <span style="display: inline-block; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; color: #6b7280;">
            ${business.category}
          </span>
        </div>
        <div style="margin-bottom: 8px; color: #6b7280; font-size: 12px;">
          📍 ${business.address || 'Dirección no disponible'}
        </div>
        <div style="margin-bottom: 4px; color: #6b7280; font-size: 12px;">
          📱 ${hasPhone}
        </div>
        <div style="margin-bottom: 8px; color: #6b7280; font-size: 12px;">
          ✉️ ${hasEmail}
        </div>
        <div style="padding-top: 8px; border-top: 1px solid #e5e7eb;">
          <span style="${statusMeta.color} padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; display: inline-block;">
            ${statusMeta.label}
          </span>
        </div>
        <button onclick="window.businessMapEvent && window.businessMapEvent('${business.id}')" style="
          margin-top: 8px;
          width: 100%;
          padding: 6px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        ">
          Ver Detalle
        </button>
      </div>
    `;
  };

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Crear mapa centrado en la ubicación promedio
    const validBusinesses = businesses.filter(b => b.latitude && b.longitude);
    if (validBusinesses.length === 0) return;

    const avgLat = validBusinesses.reduce((sum, b) => sum + b.latitude, 0) / validBusinesses.length;
    const avgLng = validBusinesses.reduce((sum, b) => sum + b.longitude, 0) / validBusinesses.length;

    const map = L.map(containerRef.current).setView([avgLat, avgLng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 3
    }).addTo(map);

    mapRef.current = map;
    clusterGroupRef.current = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'large';
        else if (count > 5) size = 'medium';

        return L.divIcon({
          html: `<div style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; font-weight: bold; font-size: 16px; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${count}</div>`,
          className: `cluster-icon cluster-${size}`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      }
    });

    map.addLayer(clusterGroupRef.current);

    // Expose function for popup button clicks
    (window as any).businessMapEvent = (businessId: string) => {
      const business = businesses.find(b => b.id === businessId);
      if (business) onSelectBusiness(business);
    };
  }, []);

  // Actualizar marcadores cuando cambian los negocios o búsqueda
  useEffect(() => {
    if (!mapRef.current || !clusterGroupRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => clusterGroupRef.current.removeLayer(marker));
    markersRef.current = [];
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const validBusinesses = businesses.filter(b => b.latitude && b.longitude);

    // Crear nuevos marcadores
    validBusinesses.forEach(business => {
      const marker = L.marker([business.latitude, business.longitude], {
        icon: createMarkerIcon(business)
      });

      const popupContent = createPopupContent(business);
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        marker.openPopup();
      });

      clusterGroupRef.current.addLayer(marker);
      markersRef.current.push(marker);
    });

    const routeCandidates = [...validBusinesses]
      .filter((business) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        return (
          business.name.toLowerCase().includes(query) ||
          business.category.toLowerCase().includes(query) ||
          business.categoryGroup.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (a.latitude !== b.latitude) return a.latitude - b.latitude;
        return a.longitude - b.longitude;
      })
      .slice(0, 12);

    if (mapRef.current && routeCandidates.length >= 2) {
      routeLayerRef.current = L.polyline(
        routeCandidates.map((business) => [business.latitude, business.longitude] as [number, number]),
        {
          color: '#0F766E',
          weight: 3,
          opacity: 0.65,
          dashArray: '8 10'
        }
      ).addTo(mapRef.current);
    }

    // Ajustar vista si hay búsqueda
    if (searchQuery.trim()) {
      const filtered = validBusinesses.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.categoryGroup.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0 && mapRef.current) {
        const group = new L.FeatureGroup(filtered.map((b, idx) => markersRef.current[validBusinesses.indexOf(b)]));
        if (filtered.length === 1) {
          mapRef.current.setView([filtered[0].latitude, filtered[0].longitude], 16);
        } else {
          mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
      }
    }
  }, [businesses, searchQuery, onSelectBusiness]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">Mapa de Negocios</h3>
        <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
          Visualización geográfica de {businesses.length} negocios con clusters interactivos
        </p>
      </div>
      
      <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
        <div
          ref={containerRef}
          style={{ height: '100%' }}
          className="w-full"
        />
      </div>
      <div className="bg-gray-50 border-t border-gray-100 p-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-xs font-semibold text-gray-700 mb-3 dark:text-slate-300">Leyenda</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="w-3 h-4 rounded" style={{ backgroundColor: '#EA580C' }}></div>
            <span>Gastronomía</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="w-3 h-4 rounded" style={{ backgroundColor: '#2563EB' }}></div>
            <span>Educación</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="w-3 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
            <span>Salud</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="w-3 h-4 rounded" style={{ backgroundColor: '#7C3AED' }}></div>
            <span>Comercio</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <div className="w-3 h-0.5 rounded bg-[#0F766E]" />
            <span>Ruta comercial</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
