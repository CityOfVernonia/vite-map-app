import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';

import ApplicationLayout from '@vernonia/application-layout/dist/ApplicationLayout';
import '@vernonia/application-layout/dist/ApplicationLayout.css';

// widgets
import Measure from '@vernonia/core/widgets/Measure';
import Print from '@vernonia/core/widgets/Print';

// config portal and auth
esriConfig.portalUrl = 'https://gisportal.vernonia-or.gov/portal';

// app config and init loading screen
const title = 'Vite Map App';

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

new ApplicationLayout({
  view,
  loaderOptions: {
    title,
  },
  contextualWidgets: [
    {
      widget: new Measure({ view }),
      text: 'Measure',
      icon: 'measure',
    },
    {
      widget: new Print({ view, printServiceUrl: '' }),
      text: 'Print',
      icon: 'print',
    },
  ],
});

// view.when(() => { });
