import React, { useEffect, useState } from 'react'
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Stats from "./Stats";
import Helpers from '../util/helpers'
import { updateBlock } from '../util/db'

const greenSpaceTypes = ['GREEN_SPACE', 'PRIVATE_GARDEN', 'COMMUNAL_GARDEN', 'ROOF_GARDEN']

function StatsSection(props) {
  const { block, blockFeatures } = props
  const [ greenSpace, setGreenSpace ] = useState(0)
  useEffect(() => {
    if (blockFeatures) {
      let g = 0
      blockFeatures.forEach(f => {

        if(greenSpaceTypes.includes(f.featureType)) {
          g += f.area
          setGreenSpace(g)
        }
      })
    }
  }, [blockFeatures])

  useEffect(() => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    if (block) {
      if (!block.locality) {
        const coords = block.feature.geometry.coordinates[0]
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]}%2C%20${coords[1]}.json?access_token=${accessToken}&types=postcode%2Clocality%2Cneighborhood`)
          .then(res => res.json())
          .then(data => {
            if (data.features && data.features[0].place_name) {
              const parts = data.features[0].place_name.split(', ')
              updateBlock(block.id, {locality: parts})
                .then(() => console.log('written to db'))
            }
          })
      }
    }
  }, [block])
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container className="text-center">
        {block.locality &&
        <h2>Block: {block.locality[0]} ({block.locality[1]})</h2>}
        <Stats
          items={[
            {
              title: "Area",
              stat: Helpers.formatNumber(block.area) + " sqm",
            },
            {
              title: "Trees",
              stat: "?",
            },
            {
              title: "Green space",
              stat: Helpers.formatNumber(greenSpace) + " sqm",
            },
            {
              title: "Ponds",
              stat: "?",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

export default StatsSection;
