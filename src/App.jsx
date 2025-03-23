import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { classmatesData, getStatistics } from './data/classmates'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  const [statistics, setStatistics] = useState({
    countryStats: {},
    cityStats: {}
  })

  // 按城市对同学数据进行分组
  const classmatesByCity = classmatesData.reduce((acc, classmate) => {
    const cityKey = classmate.city;
    if (!acc[cityKey]) {
      const firstClassmate = classmatesData.find(c => c.city === cityKey);
      acc[cityKey] = {
        country: classmate.country,
        classmates: [],
        location: firstClassmate.location
      };
    }
    acc[cityKey].classmates.push(classmate.name);
    return acc;
  }, {});

  useEffect(() => {
    const stats = getStatistics()
    setStatistics(stats)
  }, [])

  const starIcon = new Icon({
    iconUrl: '/marker-icon-2x-gold.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  return (
    <div className="app-container">
      <div className="map-container">
        <MapContainer
          center={[35.8617, 104.1954]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.entries(classmatesByCity).map(([city, data]) => (
            <Marker
              key={city}
              position={[data.location.lat, data.location.lng]}
              icon={starIcon}
            >
              <Popup>
                <div>
                  <h3>{city}, {data.country}</h3>
                  <p>{data.classmates.join('、')}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="stats-panel">
        <h2>统计信息</h2>
        <div className="stats-section">
          <h3>按国家统计</h3>
          <ul>
            {Object.entries(statistics.countryStats).map(([country, count]) => (
              <li key={country}>{country}: {count}人</li>
            ))}
          </ul>
        </div>
        <div className="stats-section">
          <h3>按城市统计</h3>
          <ul>
            {Object.entries(statistics.cityStats).map(([city, count]) => (
              <li key={city}>{city}: {count}人</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
