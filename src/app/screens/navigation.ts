import { Platform } from "react-native";
import { Navigation } from "react-native-navigation";
import { Home } from "./Home";
import { IndoorPositioning } from "./IndoorPositioning/index";
import { IndoorOutdoorPositioning } from "./IndoorOutdoorPositioning/index";
import { OutdoorPositioning } from "./OutdoorPositioning/index";
import { BuildingsOverMap } from "./BuildingsOverMap/index";
import { PositionOverMap } from "./PositionOverMap/index";
import { PoiOverMap } from "./PoiOverMap/index";
import { RouteOverMap } from "./RouteOverMap/index";
import { EventsOfBuilding } from "./EventsOfBuilding/index";
import { PointInsideGeofence } from "./PointInsideGeofence/index";
import { BuildingList } from "./BuildingList/index";
import { FloorMap } from "./FloorMap/index"
import { Settings } from "./Settings/index";

export const NavigationMap: any = {
  Home: {
    name: "Home",
    component: Home,
    options: {
      topBar: {
        title: {
          text: "Home",
        },
      },
    },
  },
  BuildingList: {
    name: "BuildingList",
    component: BuildingList,
    options: {
      topBar: {
        title: {
          text: "Select a Buildings",
        },
      },
    },
    passProps: {
      next: "",
    },
  },
  IndoorPositioning: {
    name: "IndoorPositioning",
    component: IndoorPositioning,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Indoor Positioning",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  FloorMap: {
    name: "FloorMap",
    component: FloorMap,
    options: {
      topBar: {
        title: {
          text: "FloorMap View for IPC",
        }
      }
    }
  },
  IndoorOutdoorPositioning: {
    name: "IndoorOutdoorPositioning",
    component: IndoorOutdoorPositioning,
    options: {
      topBar: {
        title: {
          text: "Indoor-outdoor Positioning",
        },
      },
    },
  },
  OutdoorPositioning: {
    name: "OutdoorPositioning",
    component: OutdoorPositioning,
    options: {
      topBar: {
        title: {
          text: "Outdoor Positioning",
        },
      },
    },
  },
  BuildingsOverMap: {
    name: "BuildingsOverMap",
    component: BuildingsOverMap,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Draw building over map",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  PositionOverMap: {
    name: "PositionOverMap",
    component: PositionOverMap,
    options: {
      topBar: {
        title: {
          text: "Draw position over map",
        },
      },
    },
  },
  PoiOverMap: {
    name: "PoiOverMap",
    component: PoiOverMap,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Draw POIs over map",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  RouteOverMap: {
    name: "RouteOverMap",
    component: RouteOverMap,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Draw route between two points over map",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  EventsOfBuilding: {
    name: "EventsOfBuilding",
    component: EventsOfBuilding,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Show all the events of a buildings",
        },
      },
    },
    passProps: {
      building: {},
    },
  },
  Settings: {
    name: "Settings",
    component: Settings,
    options: {
      topBar: {
        title: {
          text: "Settings",
        },
      },
    },
  },
  PointInsideGeofence: {
    name: "PointInsideGeofence",
    component: PointInsideGeofence,
    showBuildings: true,
    options: {
      topBar: {
        title: {
          text: "Show if point is inside a geofence",
        },
      },
    },
    passProps: {
      building: {},
    },
  }
};

export function registerScreens() {
  for (const key in NavigationMap) {
    Navigation.registerComponent(key, () => NavigationMap[key].component);
  }
}

export function getNavigationList() {
  const ignore = [NavigationMap.Home.name, NavigationMap.BuildingList.name];
  const navigations = [];
  for (const key in NavigationMap) {
    if (ignore.includes(key)) continue;

    console.log(NavigationMap[key]);
    navigations.push({
      key: key,
      value: NavigationMap[key].options.topBar.title.text,
    });
  }
  return navigations;
}
