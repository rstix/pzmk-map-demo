'use client';

import { useMemo } from 'react';
import {
	Feature,
	FeatureCollection,
	Point,
	MultiPolygon,
	GeoJsonProperties,
} from 'geojson';
import { useGeoData } from '@/hooks/useGeoData';
import MapComponent from '@/components/Map';
import { DataItem } from '@/types/GeoData';

export type ProcessedData = {
	points: FeatureCollection<Point, GeoJsonProperties>;
	polygons: FeatureCollection<MultiPolygon, GeoJsonProperties>;
};

export default function Home() {
	const { data, isLoading, isError } = useGeoData();

	const processedData = useMemo<ProcessedData>(() => {
		const defaultResult: ProcessedData = {
			points: { type: 'FeatureCollection', features: [] },
			polygons: { type: 'FeatureCollection', features: [] },
		};

		if (!data) return defaultResult;

		const points: Feature<Point, GeoJsonProperties>[] = [];
		const polygons: Feature<MultiPolygon, GeoJsonProperties>[] = [];

		const seenPolygons = new Set<string>();

		data.forEach((item) => {
			const { def_point, coordinates, ...properties } = item;

			if (def_point) {
				const { type: ptType, coordinates: ptCoords } = def_point;
				points.push({
					type: 'Feature',
					geometry: {
						type: ptType,
						coordinates: ptCoords,
					},
					properties: { ...properties } as DataItem,
				});
			}
			if (coordinates && coordinates.coordinates) {
				const coordString = JSON.stringify(coordinates.coordinates);

				if (!seenPolygons.has(coordString)) {
					seenPolygons.add(coordString);
					const { type: polyType, coordinates: polyCoords } = coordinates;
					polygons.push({
						type: 'Feature',
						geometry: {
							type: polyType,
							coordinates: polyCoords,
						},
						properties: { ...properties } as DataItem,
					});
				}
			}
		});

		return {
			points: { type: 'FeatureCollection', features: points },
			polygons: { type: 'FeatureCollection', features: polygons },
		};
	}, [data]);

	if (isLoading) return <div className="p-4 text-lg">Načítání...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Chyba při načítání dat</div>;

	return (
		<div className="w-full h-screen">
			<MapComponent data={processedData} />
		</div>
	);
}
