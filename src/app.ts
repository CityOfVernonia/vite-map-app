import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// loading screen
import LoadingScreen from '@vernonia/core/widgets/LoadingScreen';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';

// layout
import Viewer from '@vernonia/core/layouts/Viewer';

// widgets
import ViewControl from '@vernonia/core/widgets/ViewControl';

// config portal and auth
esriConfig.portalUrl = 'https://gisportal.vernonia-or.gov/portal';

// app config and init loading screen
const title = 'Vite Map App';

const loadingScreen = new LoadingScreen({
  title,
});

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
});

view.when(() => {
  view.ui.add(new ViewControl({ view }), 'top-left');

  loadingScreen.end();
});
