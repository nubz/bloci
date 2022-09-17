import React, {useEffect} from "react";
import { useParams } from "react-router-dom"
import { requireAuth } from '../util/auth'
import StatsSection from '../components/StatsSection'
import BlockMap from '../components/Mapbox/block-map'
import { useBlock, useBlockFeatures } from '../util/db'
import DeleteBlock from "../components/DeleteBlock";
import { useHistory } from "react-router-dom";

function BlockPage() {
  const { history } = useHistory()
  let { id } = useParams()
  const {
    data
  } = useBlock(id)

  useEffect(() => {
    if (history && !data) {
      history.push('/set-block')
    }
  }, [data, history])

  const { data: blockFeatures } = useBlockFeatures(id)
  return (
    <>
      {data && blockFeatures ?
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
          <DeleteBlock id={id} />
        </>
          :
          <p>
            The block has been deleted,
            <a href="/set-block">View map</a>
          </p>
      }
    </>

  );
}

export default requireAuth(BlockPage)
