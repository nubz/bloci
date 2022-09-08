import React from "react";
import Mapbox from "../components/Mapbox"
import Container from 'react-bootstrap/Container'
import { requireAuth } from '../util/auth'
import { useLocation } from "react-router-dom";
function SetBlockPage(props) {
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const blockOwner = query.get('id');
  console.log('query', blockOwner)
  return (
    <>
      <Mapbox blockOwner={blockOwner} />
      <Container className={'mt-3'}>
          <p>
            Use the Polygon tool to mark out your block.
          </p>
          <p>
            Click on the same point you started with to close the area and be able to save your block.
          </p>
      </Container>
    </>

  );
}

export default requireAuth(SetBlockPage)
