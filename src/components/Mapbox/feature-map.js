import React, { useEffect, useRef, useState } from "react"
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import "./map-control.scss"
import { firestoreToGeoJSON } from '../../util/db'
import { useAuth } from '../../util/auth'

const styles = {
  width: "100%",
  height: "calc(100% - 20px)",
  position: "absolute"
}

const FeatureMap = props => {
  const { feature } = props
  const auth = useAuth()
  const uid = auth.user ? auth.user.uid : undefined
  const [map, setMap] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const mapContainer = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const initializeMap = ({ setMap, mapContainer }) => {
      setMapLoaded(false)
      const geoJson = firestoreToGeoJSON(feature.feature)
      const coordinates = geoJson.geometry.coordinates[0]
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: coordinates[0],
        zoom: 10,
        antialias: true
      });

      map.on("load", () => {
        setMapLoaded(true)
        setMap(map)

        const bounds = coordinates.reduce(function(bounds, coord) {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        map.fitBounds(bounds, {
          padding: 50
        });
      });
    };

    if (!map && feature) initializeMap({ setMap, mapContainer })
  }, [map, feature]);

  useEffect(() => {
    if (
      mapLoaded &&
      map &&
      feature
    ) {
      if (!map.getSource(feature.id)) {
        map.addSource(feature.id, {
          'type': 'geojson',
          'data': firestoreToGeoJSON(feature.feature)
        })

        map.addLayer({
          'id': feature.id,
          'type': 'line',
          'source': feature.id,
          'layout': {},
          'paint': {
            'line-color': '#7DF9FF',
            'line-width': 3
          }
        })

      }

    }
  }, [map, feature, mapLoaded])

  return (
    <div style={{height: '400px', position: 'relative'}}>
      <div ref={mapContainer} style={styles} />
    </div>

  )
};

export default FeatureMap
