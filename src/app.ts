// import esri = __esri;

// esri config and auth
import esriConfig from '@arcgis/core/config';

// loading screen
import LoadingScreen from './core/widgets/LoadingScreen';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';

// the viewer
import Viewer from './core/Viewer';

// app config and init loading screen
const title = 'Vite Map App';

const loadingScreen = new LoadingScreen({
  title,
});

// config portal and auth
esriConfig.portalUrl = 'https://gisportal.vernonia-or.gov/portal';

// view
const view = new MapView({
  map: new Map({
    basemap: new Basemap({
      portalItem: {
        id: 'f36cd213cc934d2391f58f389fc9eaec',
      },
    }),
    layers: [],
    ground: 'world-elevation',
  }),
  zoom: 15,
  center: [-123.18291178267039, 45.8616094153766],
  constraints: {
    rotationEnabled: false,
  },
  popup: {
    dockEnabled: true,
    dockOptions: {
      position: 'bottom-left',
      breakpoint: false,
    },
  },
});

new Viewer({
  view,
  title,
  // includeHeader: false,
  widgets: [],
});

view.when(() => {
  loadingScreen.end();
});
