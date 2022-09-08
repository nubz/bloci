import React from "react";
import { useParams } from "react-router-dom"
import { requireAuth } from '../util/auth'
import StatsSection from '../components/StatsSection'
import BlockMap from '../components/Mapbox/block-map'
import { useBlock, useBlockFeatures } from '../util/db'

function BlockPage() {
  let { id } = useParams()
  const {
    data
  } = useBlock(id)

  const { data: blockFeatures } = useBlockFeatures(id)
  return (
    <>
      {data && blockFeatures &&
        <>
          <BlockMap block={data} blockFeatures={blockFeatures} />
          <StatsSection
            bg="light"
            textColor="dark"
            size="sm"
            bgImage=""
            bgImageOpacity={1}
            block={data}
            blockFeatures={blockFeatures}
          />

        </>
      }
    </>

  );
}

export default requireAuth(BlockPage)
