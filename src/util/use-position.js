import {useState, useEffect} from 'react';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

export const usePosition = (watch = false, settings = defaultSettings) => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({coords}) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };
  const onError = (error) => {
    setError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    let watcher = null;

    if (watch) {
      watcher =
        navigator.geolocation.watchPosition(onChange, onError, settings);
    } else {
      navigator.geolocation.getCurrentPosition(onChange, onError, settings);
    }

    return () => geo.clearWatch(watcher);

  }, [settings, watch]);
  return {...position, error};
}