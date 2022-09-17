import React from "react";
import { useParams } from "react-router-dom"
import { requireAuth } from '../util/auth'
import {useBlockFeature, useFeatureType} from '../util/db'
import FeatureMap from '../components/Mapbox/feature-map'
import GardenStats from '../components/GardenStats'
import DeleteFeature from "../components/DeleteFeature";
import {Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AsyncSpecies from "../components/Autocomplete";


const featureTypes = {
  'PRIVATE_GARDEN': 'Privately owned garden',
  'COMMUNAL_GARDEN': 'Shared private garden',
  'GREEN_SPACE': 'Municipal or common green space',
  'ROOF_GARDEN': 'Roof garden',
  'POND': 'Pond'
}

function FeaturePage() {
  let { id } = useParams()
  const { data } = useBlockFeature(id)
  return (
    <Container className="ptop">
      {data && data.blockId ?
          <>
            <a href={`/block/${data.blockId}`}>View parent block</a>
            <h2>{featureTypes[data.featureType]}</h2>
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
          </>
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
