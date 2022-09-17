import React, { useEffect, useState } from 'react'
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Stats from "./Stats";
import Helpers from '../util/helpers'
import { updateFeature } from '../util/db'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import AsyncSpecies from "./Autocomplete";

function GardenStats(props) {
  const { garden } = props
  useEffect(() => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    if (garden) {
      if (!garden.locality) {
        const coords = garden.feature.geometry.coordinates[0]
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]}%2C%20${coords[1]}.json?access_token=${accessToken}&types=postcode%2Clocality%2Cneighborhood`)
          .then(res => res.json())
          .then(data => {
            if (data.features && data.features[0].place_name) {
              const parts = data.features[0].place_name.split(', ')
              updateFeature(garden.id, {locality: parts})
                .then(() => console.log('written to db'))
            }
          })
      }
    }
  }, [garden])

  const featureTypes = {
    'PRIVATE_GARDEN': 'Privately owned garden',
    'COMMUNAL_GARDEN': 'Shared private garden',
    'GREEN_SPACE': 'Municipal or common green space',
    'ROOF_GARDEN': 'Roof garden'
  }
  const gardenFeatureTypes = {
    'POND': 'Pond',
    'TREE': 'Tree',
    'LAWN': 'Lawn',
    'WILD_GRASS': 'Wild grass',
    'OPEN_BORDER': 'Open border',
    'FLOWER_BEDS': 'Flower beds',
    'BUSHES': 'Bushes',
    'COMPOST': 'Compost area',
    'VEGETABLE_PATCH': 'Vegetable patch',
    'PET_ENCLOSURE': 'Pet enclosure',
    'WOOD_PILE': 'Wood pile',
    'OPEN_EARTH': 'Open earth',
    'OUTBUILDING': 'Outbuilding/Shed'
  }
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      {garden && garden.locality &&
        <Container className="text-center">
        <Stats
          items={[
            {
              title: "Area",
              stat: Helpers.formatNumber(garden.area) + " sqm",
            },
            {
              title: "Trees",
              stat: "?",
            },
            {
              title: "Green space",
              stat: Helpers.formatNumber(garden.area) + " sqm",
            },
            {
              title: "Ponds",
              stat: "?",
            },
          ]}
        />

          <DropdownButton
              id={`dropdown-button-drop-feature-types`}
              style={{display: 'inline-block', marginLeft: '1em'}}
              drop={`down`}
              variant="primary"
              size={"small"}
              title={'Add a fixture '}
          >
            {Object.keys(gardenFeatureTypes).map(f => (
                <Dropdown.Item
                    key={f}
                    eventKey={f}
                >
                  {gardenFeatureTypes[f]}
                </Dropdown.Item>
            ))}
          </DropdownButton>
      </Container>
      }
    </Section>
  );
}

export default GardenStats;
