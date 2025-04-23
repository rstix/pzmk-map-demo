import { useEffect, useRef } from 'react';
import maplibregl, { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { ProcessedData } from '@/app/page';

import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
	data: ProcessedData;
}

export default function MapComponent({ data }: MapProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<Map | null>(null);

	useEffect(() => {
		if (!mapContainer.current || !data) return;

		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: 'https://demotiles.maplibre.org/style.json',
			center: [15.631141662597656, 49.89264385266563],
			zoom: 7,
		});

		map.current.on('load', () => {
			map.current!.addSource('points', {
				type: 'geojson',
				data: data.points,
			});

			map.current!.addLayer({
				id: 'points',
				type: 'circle',
				source: 'points',
				paint: {
					'circle-radius': 5,
					'circle-color': '#FF6B6B',
					'circle-stroke-width': 1,
					'circle-stroke-color': '#FFFFFF',
					'circle-opacity': 0.8,
				},
				maxzoom: 14,
			});

			map.current!.addSource('polygons', {
				type: 'geojson',
				data: data.polygons,
			});

			map.current!.addLayer({
				id: 'polygons',
				type: 'fill',
				source: 'polygons',
				paint: {
					'fill-color': '#4ECDC4',
					'fill-opacity': 0.6,
				},
				minzoom: 14,
			});

			const handleClick = (
				e: MapLayerMouseEvent,
				layerType: 'points' | 'polygons'
			) => {
				const feature = e.features?.[0];
				if (!feature) return;

				new maplibregl.Popup()
					.setLngLat(e.lngLat)
					.setHTML(
						`
            <div>
              <h3 class="font-bold mb-1">${
								layerType === 'points' ? 'Bod' : 'Polygon'
							}</h3>
              <p class="text-sm">List vlastictvi: ${feature.properties.lv}</p>
              <p class="text-sm">Typ: ${feature.properties.typ}</p>
            </div>
          `
					)
					.addTo(map.current!);
			};

			map.current!.on('click', 'points', (e) => handleClick(e, 'points'));
			map.current!.on('click', 'polygons', (e) => handleClick(e, 'polygons'));
		});

		return () => {
			map.current?.remove();
		};
	}, [data]);

	return <div ref={mapContainer} className="w-full h-full" />;
}
