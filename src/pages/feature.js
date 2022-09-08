import React from "react";
import { useParams } from "react-router-dom"
import { requireAuth } from '../util/auth'
import { useBlockFeature } from '../util/db'
import Container from 'react-bootstrap/Container'
import FeatureMap from '../components/Mapbox/feature-map'
import GardenStats from '../components/GardenStats'

function FeaturePage() {
  let { id } = useParams()
  const { data } = useBlockFeature(id)
  console.log('data', data)
  return (
    <>
      { data && <FeatureMap feature={data} /> }
      <GardenStats garden={data} />
      <Container>
        <p>
          Information about this garden or feature can be authored by the owner...
        </p>
      </Container>
    </>

  );
}

export default requireAuth(FeaturePage)
