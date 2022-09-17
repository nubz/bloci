import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom"
import { requireAuth } from '../util/auth'
import {useBlock, useBlockFeature} from '../util/db'
import FeatureMap from '../components/Mapbox/feature-map'
import GardenStats from '../components/GardenStats'
import DeleteFeature from "../components/DeleteFeature";
import Button from "react-bootstrap/Button";
import {Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AsyncSpecies from "../components/Autocomplete";

const featureTypes = {
  'PRIVATE_GARDEN': 'Privately owned garden',
  'COMMUNAL_GARDEN': 'Shared private garden',
  'GREEN_SPACE': 'Municipal or common green space',
  'ROOF_GARDEN': 'Roof garden'
}

function FeaturePage() {
  let { id } = useParams()
  const { data } = useBlockFeature(id)
  const [blockLink, setBlockLink] = useState(null)
  useEffect(() => {
    if (data && data.blockId) {
       setBlockLink("/block/" + data.blockId)
    }
  }, [data])
  return (
    <Container className="ptop">
      {data && <><a href={blockLink}>View parent block</a><h2>{featureTypes[data.featureType]}: {data.locality[0]} ({data.locality[1]})</h2></>}
      {data && data.blockId ?
            <Tabs
                defaultActiveKey="map"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
              <Tab eventKey="map" title="Map">
                <FeatureMap feature={data}/>
              </Tab>
              <Tab eventKey="fixtures" title="Fixtures">
                <GardenStats garden={data}/>
              </Tab>
              <Tab eventKey="sightings" title="Sightings">
                <div className="auto-suggest">
                  <h2>Report a sighting</h2>
                  <AsyncSpecies />
                </div>
              </Tab>
              <Tab eventKey="delete" title="Delete">
                <DeleteFeature id={id} blockId={data.blockId}/>
              </Tab>
            </Tabs>

          :
          <p>
            The feature has been deleted,
            <a href="javascript:history.go(-1);">View block</a>
          </p>
      }
    </Container>

  );
}

export default requireAuth(FeaturePage)
