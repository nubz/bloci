import React, { useEffect, useRef, useState } from "react"
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import "./map-control.scss"
import { createFeature, useBlockFeatures, firestoreToGeoJSON, useFeatures } from '../../util/db'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as turf from '@turf/turf'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { useAuth } from '../../util/auth'
import { history } from '../../util/router'

const styles = {
  width: "100%",
  height: "calc(100% - 0px)",
  position: "absolute"
}

const BlockMap = props => {
  const { block, blockFeatures } = props
  const auth = useAuth()
  const uid = auth.user ? auth.user.uid : undefined
  const [map, setMap] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [newFeature, setNewFeature ] = useState(null)
  const [blockArea, setBlockArea] = useState(0)
  const [resetMap, setResetMap] = useState(false)
  const [ featureType, setFeatureType ] = useState('Type of feature')

  const mapContainer = useRef(null)

  const { data: featureTypes } = useFeatures()

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const initializeMap = ({ setMap, mapContainer }) => {
      setResetMap(false)
      setMapLoaded(false)
      const geoJson = firestoreToGeoJSON(block.feature)
      const coordinates = geoJson.geometry.coordinates[0]
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11",
        center: coordinates[0],
        zoom: 17,
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
            setNewFeature(data)
          } else {
            console.log('data has no features')
            setBlockArea(0)
          }
        }

        setMap(map)

        const bounds = coordinates.reduce(function(b, coord) {
          return b.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        map.fitBounds(bounds, {
          padding: 20
        });
      });
    };

    if ((!map && block && block.feature) || resetMap) initializeMap({ setMap, mapContainer })
  }, [map, block, resetMap]);

  useEffect(() => {
    if (
      mapLoaded &&
      map &&
      block &&
      blockFeatures
    ) {
      if (!map.getSource(block.id)) {
        map.addSource(block.id, {
          'type': 'geojson',
          'data': firestoreToGeoJSON(block.feature)
        })

        map.addLayer({
          'id': block.id,
          'type': 'fill',
          'source': block.id,
          'layout': {},
          'paint': {
            'fill-color': '#4caf50',
            'fill-opacity': 0.5
          }
        })

      }

      map.getSource(block.id) && blockFeatures && blockFeatures.map(b => {
        const feature = b.feature
        const featureId = `features-${feature.id}`
        if (!map.getSource(featureId)) {
          map.addSource(featureId, {
            'type': 'geojson',
            'data': firestoreToGeoJSON(feature)
          })

          map.addLayer({
            'id': featureId,
            'type': 'fill',
            'source': featureId,
            'layout': {},
            'paint': {
              'fill-color': '#ff4136',
              'fill-opacity': 0.8
            }
          })

          map.on('click', featureId, (e) => {
            history.push(`/feature/${block.id}/${b.id}`)
          })

          map.on('touchend', featureId, () => {
            history.push(`/feature/${block.id}/${b.id}`)
          })

          map.on('mousemove', featureId, (e) => {
            map.getCanvas().style.cursor = 'pointer';
          })

          map.on('mouseleave', featureId, (e) => {
            map.getCanvas().style.cursor = '';
          })

        }
      })
    }
  }, [map, block, blockFeatures, mapLoaded])

  const saveFeature = () => {
    const data = {
      owner: uid,
      blockId: block.id,
      area: blockArea,
      feature: newFeature.features[0],
      featureType: featureType
    }

    createFeature(data)
      .then(() => {
        setNewFeature(null)
        setBlockArea(0)
        setResetMap(true)
      })
  }

  return (
    <div style={{height: '480px', position: 'relative'}}>
      <div ref={mapContainer} style={styles} />
      {blockArea && featureTypes ?
        <div className='map-control'>
          <p>
            Feature area {blockArea} sq meters
          </p>
          <p>
            Feature type:
          </p>
          <DropdownButton
            id={`dropdown-button-drop-feature-types`}
            drop={`down`}
            variant="secondary"
            size={"small"}
            title={featureType}
          >
            {featureTypes.length > 0 && featureTypes.map(f => (
              <Dropdown.Item
                key={f.type}
                eventKey={f.type}
                onClick={e => setFeatureType(f.type)}
              >
                {f.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <button onClick={saveFeature}>Save feature</button>
        </div> :
        <div className='map-control'>
          <p>Draw a feature using the polygon tool</p>
        </div>
      }
    </div>

  )
};

export default BlockMap
