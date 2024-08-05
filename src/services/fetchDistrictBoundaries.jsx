export async function fetchDistrictBoundaries() {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `
            area["ISO3166-2"="VN-SG"];
            (
            relation["admin_level"="8"](area);
            );
            /*added by auto repair*/
            (._;>;);
            /*end of auto repair*/
            out body;`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
  
    return response;
 }