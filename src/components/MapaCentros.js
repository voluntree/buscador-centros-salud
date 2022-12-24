import React from 'react'
import { GoogleMap, Marker, useJsApiLoader,  } from '@react-google-maps/api';
import md5 from 'md5';

const icons = {
  hospital: {
    icon: "https://drive.google.com/uc?export=view&id=1IL4IrMX8xzoA8Usn6R2qUlmQZMHqFlAD"
  },
  "centro de salud": {
    icon: "https://drive.google.com/uc?export=view&id=1LQVATpjMgZXgz4bFx85wA6gFKerdxUpV"
  },
  otros: {
    icon: "https://drive.google.com/uc?export=view&id=1x1285DIR-Rw5zZ7H3sFHEW1-AnULh3s1"
  }
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
    lat:40.41831,
    lng: -3.70275
  }

const MapaCentros = (props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyACpAdm3w3zmrvsSJ5KgKtNQff7nslAbj0"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {props.centros.map(centro => { 
           return <Marker key={md5(centro.nombre)} position={{lat: centro.latitud, lng: centro.longitud}}
                          icon = {icons[centro.tipo.toLowerCase()].icon}
                          title={centro.nombre}>
                  </Marker>
        })}
        
      </GoogleMap>
  ) : <></>
}

export default React.memo(MapaCentros)