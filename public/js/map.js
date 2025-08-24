
const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapApi}`,
  center: coordinates,
  zoom: 9
});
const marker=new maplibregl.Marker({color:'red'})
.setLngLat(coordinates)
 .setPopup(new maplibregl.Popup({offset:25}).setHTML(`<h4>WELLCOME </h4><p>Exact Location Provuded after booking</p>`))
.addTo(map);