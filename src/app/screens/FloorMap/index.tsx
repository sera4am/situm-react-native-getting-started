import React, {useEffect, useState} from "react"
import MapView, {Marker, Overlay, PROVIDER_GOOGLE} from "react-native-maps"
import SitumPlugin from "react-native-situm-plugin"
import Geolocation from "react-native-geolocation-service"
import { getDistance } from "geolib"

interface Props {
    style:any
}

export const FloorMap = (props: { componentId: string }) => {


    const [location, setLocation] = useState<any>(null)
    const [position, setPosition] = useState<any>(null)
    const [building, setBuilding] = useState<any>(null)
    const [floorIdentifier, setFloorIdentifier] = useState<any>()
    const [floors, setFloors] = useState<Array<any>>()
    const [bounds, setBounds] = useState<any>()
    const [mapRegion, setMapRegion] = useState<any>(null)
    const [mapImage, setMapImage] = useState<String>()
    const [prevBuilding, setPrevBuilding] = useState<any>(null)

    let pluginEnabled:boolean = false
    let locationWatchId:any = null
    let map:any
    let subscriptionId:any = null

    useEffect(() => {

        SitumPlugin.requestAuthorization()

        locationWatchId = Geolocation.watchPosition(
            (position:any) => {
                setLocation({
                    type: 'geolocation',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    bearing: position.coords.heading,
                    accuracy: position.coords.accuracy,
                })
            },
            (error:any) => {
                console.log('Receive location', 'error', error)
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0,
                interval: 1000,
                fastestInterval: 500,
            },
        )

    }, [])

    useEffect(　() => {

        if (!location || position) { return }

        const fetch = async () => {
            console.log('Update state', 'location')
            map.animateCamera({
                center: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                pitch: 0,
                heading: 0,

                altitude: 0,
                zoom: map.getCamera.zoom,
            })

            await getBuilding()
        }
        fetch()
    }, [location])

    useEffect(() => {
        if (!position) { return }
        map.animateCamera({
            center: {
                latitude: position.latitude,
                longitude: position.longitude,
            },
            pitch: map.getCamera.pitch,
            heading: map.getCamera.heading,
            altitude: map.getCamera().altitude,
            zoom: map.getCamera.zoom,
        })
    }, [position])

    useEffect(() => {
        const fetch = async () => {
            if (!building) { return }
            if (prevBuilding && prevBuilding === building.buildingIdentifier) {
                return
            }
            setPrevBuilding(building.buildingIdentifier)

            if (subscriptionId) {
                SitumPlugin.stopPositioning(subscriptionId, () => {
                    setPosition(null)
                    setFloorIdentifier(null)
                    subscriptionId = null
                })
            }

            SitumPlugin.fetchFloorsFromBuilding(
                building,
                (r:Array<any>) => {
                    console.log('GetFloors', r)
                    setFloors(r)
                },
                (error:any) => {
                    console.log('GetFloors error', error)
                }
            )

            setBounds([
                [
                    building.bounds.northEast.latitude,
                    building.bounds.southWest.longitude,
                ],
                [
                    building.bounds.southWest.latitude,
                    building.bounds.northEast.longitude,
                ],
            ])

            setMapRegion({
                latitude: building.center.latitude,
                longitude: building.center.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            })

            console.log('Start positioning')
            subscriptionId = await SitumPlugin.startPositioning(
                (listen:any) => {
                    if (listen.isIndoor) {
                        setPosition({
                            type: 'situm_positioning',
                            ...listen.position.coordinate,
                            bearing: listen.bearing.degrees,
                        })

                        setFloorIdentifier(listen.floorIdentifier)

                    } else {
                        setBuilding(null)
                    }
                },
                (status:any) => {
                    console.log('Positioning', 'status', status)
                },
                (error:any) => {
                    console.log('Positioning', 'error', error)
                },
                {buildingIdentifier: building.buildingIdentifier},
            )
        }
        fetch()
    }, [building])

    useEffect(() => {
        if (!floorIdentifier || !floors) { return }


        let f = floors.filter((v:any) => {
            return v.identifier === floorIdentifier
        })

        console.log(bounds)
        if (f.length > 0) {
            setMapImage(f[0].mapUrl)
        }

    }, [floors, floorIdentifier])

    const getBuilding = () => {
        if (!location) { return }

        return new Promise(async (resolve, reject) => {
            SitumPlugin.fetchBuildings(
                async (buildings:any) => {
                    let nearestBuilding = null
                    for (let b of buildings) {
                        if (!nearestBuilding) {
                            nearestBuilding = b
                        } else {
                            if (getDistance(nearestBuilding.center, location) > getDistance(b.center, location)) {
                                nearestBuilding = b
                            }
                        }
                    }
                    setBuilding(nearestBuilding)
                    resolve()
                },
                (error:any) => {
                    reject(error)
                },
            )
        })
    }

    const onUserLocationChange = () => {
        console.log('changed!!')
    }

    return (
        <MapView
            ref={m => map = m}
            mapType="satellite"
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsScale={true}
            onUserLocationChange={onUserLocationChange}
            initialRegion={{
                latitude: 35.68547446159457,
                longitude: 139.75297856553277,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {location && !position && <Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
                rotation={location.bearing}
                anchor={{x:0.5, y:0.5}}
                flat={true}
                icon={require('./Resources/Images/arrow.png')} />}
            {position && <Marker
                coordinate={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                }}
                rotation={position.bearing}
                anchor={{x:0.5, y:0.5}}
                flat={true}
                icon={require('./Resources/Images/arrow_indoor.png')} />}

            {mapImage && <Overlay
                image={mapImage}
                bounds={bounds}
                zIndex={1000}
                location={[mapRegion.latitude, mapRegion.longitude]}
                bearing={(building.rotation * 180) / Math.PI}
                anchor={[0.5, 0.5]}
                width={building.dimensions.width}
                height={building.dimensions.height}

            />}

        </MapView>
    )

}
