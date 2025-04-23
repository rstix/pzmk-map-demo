import { DataItem } from '@/types/GeoData';
import { useQuery } from '@tanstack/react-query';

const URL =
	'https://gist.githubusercontent.com/davidtyemnyak/fb7b8e5fc64994a57992d9963f473c91/raw/76d2efd3da158f59ba8984ffc205f7e1bec5138b/data.json';

async function fetchData(): Promise<DataItem[]> {
	const res = await fetch(URL);
	if (!res.ok) throw new Error('Network response was not ok');

	const json = await res.json();
	return json.result.data;
}

export function useGeoData() {
	return useQuery<DataItem[]>({
		queryKey: ['mapData'],
		queryFn: fetchData,
	});
}
