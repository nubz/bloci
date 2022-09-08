import React, { useEffect, useRef, useState } from "react"
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as turf from '@turf/turf'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { usePosition } from '../../util/use-position'
import "./map-control.scss"
import { useAuth } from '../../util/auth'
import { createBlock, useBlocksByOwner, firestoreToGeoJSON } from '../../util/db'
import { history } from '../../util/router'

const styles = {
  width: "100%",
  height: "calc(100% - 0px)",
  position: "absolute"
}

const MapboxGLMap = props => {
  const { blockOwner } = props
  const auth = useAuth()
  const uid = blockOwner || (auth.user ? auth.user.uid : undefined)
  const [map, setMap] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [block, setBlock ] = useState(null)
  const [blockArea, setBlockArea] = useState(0)
  const mapContainer = useRef(null)
  const {
    latitude,
    longitude
  } = usePosition(false)
  const {
    data: blocks
  } = useBlocksByOwner(uid)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const initializeMap = ({ setMap, mapContainer }) => {

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: [longitude, latitude],
        zoom: 17,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      });

      map.on("load", () => {
        setMapLoaded(true)
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          }
        })

        map.addControl(draw, 'top-left')

        map.on('draw.create', updateArea)
        map.on('draw.delete', updateArea)
        map.on('draw.update', updateArea)

        function updateArea(e) {
          const data = draw.getAll()
          if (data.features.length > 0) {
            const area = turf.area(data)
            setBlockArea(Math.round(area * 100) / 100)
            setBlock(data)
          } else {
            setBlockArea(0)
          }
        }

        setMap(map);
        map.resize();
      });
    };

    if (!map && latitude) initializeMap({ setMap, mapContainer })
  }, [map, latitude, longitude]);
  let seedBounds = undefined
  useEffect(() => {
    if (mapLoaded && map && blocks && blocks.length > 0) {

      blocks.forEach(b => {
        const data = firestoreToGeoJSON(b.feature)
        if (!map.getSource(b.id)) {
          const coordinates = data.geometry.coordinates[0]
          map.addSource(b.id, {
            'type': 'geojson',
            'data': firestoreToGeoJSON(b.feature)
          })

          map.addLayer({
            'id': b.id,
            'type': 'fill',
            'source': b.id,
            'layout': {},
            'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.7
            }
          })

          map.on('click', b.id, (e) => {
              history.push(`/block/${b.id}`)
          })

          map.on('touchend', b.id, () => {
            history.push(`/block/${b.id}`)
          })

          map.on('mousemove', b.id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
          })

          map.on('mouseleave', b.id, (e) => {
            map.getCanvas().style.cursor = '';
          })

          seedBounds = seedBounds || new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])

          coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
          }, seedBounds);

        }

      })

      map.fitBounds(seedBounds, {
        padding: 20
      });
    }


  }, [map, blocks, mapLoaded])

  const saveBlock = e => {
    const data = {
      owner: uid,
      area: blockArea,
      feature: block.features[0]
    }

    createBlock(data)
      .then(() => {
        setBlock(null)
        setBlockArea(0)
      })

  }

  return (
    <div style={{minHeight: "70vh", position: 'relative'}}>
      <div ref={mapContainer} style={styles} />
      {blockArea ?
        <div className='map-control'>
          <p>
            Block area {blockArea} sq meters
          </p>
          <button onClick={saveBlock}>Save block</button>
        </div> : null}
    </div>

  )
};

export default MapboxGLMap
