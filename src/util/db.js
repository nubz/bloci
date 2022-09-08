import { useState, useEffect, useRef } from "react";
import firebase from "./firebase";

const firestore = firebase.firestore();

/**** USERS ****/

// Fetch user data (hook)
// This is called automatically by auth.js and merged into auth.user
export function useUser(uid) {
  return useQuery(uid && firestore.collection("users").doc(uid));
}

// Update an existing user
export function updateUser(uid, data) {
  return firestore.collection("users").doc(uid).update(data);
}

// Create a new user
export function createUser(uid, data) {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Fetch all items by owner (hook)
export function useBlocksByOwner(owner) {
  return useQuery(
    owner && firestore.collection("blocks").where("owner", "==", owner)
  );
}

export function useFeatures() {
  return useQuery(firestore.collection("featureTypes"))
}

export function useBlockFeatures(id) {
  return useQuery(id && firestore.collection("features").where("blockId", "==", id))
}

export function useBlockFeature(id) {
  return useQuery(id && firestore.collection("features").doc(id))
}

export function featureTypeName(id) {

}

// Fetch item data
export function useBlock(id) {
  return useQuery(id && firestore.collection("blocks").doc(id));
}

export function updateBlock(id, data) {
  return firestore.collection("blocks").doc(id).update(data);
}

export function createFeature(data) {
  const normalised = {
    owner: data.owner,
    blockId: data.blockId,
    feature: geoJSONToFirestore(data.feature),
    area: data.area,
    featureType: data.featureType
  }
  return firestore.collection("features").add(normalised);
}

export function updateFeature(id, data) {
  return firestore.collection("features").doc(id).update(data);
}


export function createBlock(data) {
  const normalised = {
    owner: data.owner,
    feature: geoJSONToFirestore(data.feature),
    area: data.area
  }
  return firestore.collection("blocks").add(normalised);
}

/**** HELPERS ****/

const geoJSONToFirestore = data => {
  const coordinates = {}
  data.geometry.coordinates[0].forEach((c, i) =>
    coordinates[i] = c
  )
  return {
    id: data.id,
    type: data.type,
    geometry: {
      type: data.geometry.type,
      coordinates: coordinates
    }
  }
}

export function firestoreToGeoJSON(feature) {
  const coordinates = [];
  const coordsObj = feature.geometry.coordinates
  for(const c in coordsObj) {
    if(coordsObj.hasOwnProperty(c)) {
      coordinates.push(coordsObj[c])
    }
  }
  return {
    id: feature.id,
    type: feature.type,
    geometry: {
      type: feature.geometry.type,
      coordinates: [coordinates]
    }
  }
}

// Custom React hook that subscribes to a Firestore query
function useQuery(query) {
  const initialState = {
    status: "loading",
    data: undefined,
    error: null,
  };

  const [state, setState] = useState(initialState);

  // Gives us previous query object if query is the same
  // ensuring we don't unsubscribe and resubscribe below.
  const queryCached = useQueryCache(query);

  useEffect(() => {
    // Subscribe to query unless falsy, which indicates we're
    // waiting on other data needed to construct the query object.
    if (queryCached) {
      return queryCached.onSnapshot(
        (response) => {
          // Get data for collection or doc
          const data = response.docs
            ? getCollectionData(response)
            : getDocData(response);

          setState({
            status: "success",
            data: data,
            error: null,
          });
        },
        (error) => {
          setState((state) => ({
            status: "error",
            data: undefined,
            error: error,
          }));
        }
      );
    } else {
      // Reset back to initial state
      if (state.status !== initialState.status) {
        setState(initialState);
      }
    }
  }, [queryCached]);

  return state;
}

// Get doc data
function getDocData(doc) {
  return doc.exists === true ? { id: doc.id, ...doc.data() } : null;
}

// Get array of doc data from collection
function getCollectionData(collection) {
  return collection.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
}

function useQueryCache(query) {
  // Ref for storing previous query object
  const previousRef = useRef();
  const previous = previousRef.current;

  // Determine if query object is equal to previous
  const isEqual =
    (!previous && !query) || (previous && query && previous.isEqual(query));

  // If not equal update previous to query (for next render)
  // and then return new query below.
  useEffect(() => {
    if (!isEqual) {
      previousRef.current = query;
    }
  });

  return isEqual ? previous : query;
}
