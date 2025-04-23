interface CrsName {
	type: 'name';
	properties: { name: string };
}

export interface DataItem {
	bud_kn_id: number | null;
	kn_id: number;
	lv: string;
	par_kn_id: number | null;
	podil: string;
	podil_budovy: string;
	row_id: string;
	typ: string;

	def_point?: {
		type: 'Point';
		coordinates: [number, number];
		crs: CrsName;
	};

	coordinates?: {
		type: 'MultiPolygon';
		coordinates: number[][][][];
		crs: CrsName;
	};
}
