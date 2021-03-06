import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

// layout
import Layout from '@vernonia/core/dist/Layout';
import '@vernonia/core/dist/Layout.css';

// widgets
import Measure from '@vernonia/core/dist/widgets/Measure';
import '@vernonia/core/dist/widgets/Measure.css';

import PrintSnapshot from '@vernonia/core/dist/widgets/PrintSnapshot';
import '@vernonia/core/dist/widgets/Snapshot.css';

// config portal and auth
esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

// app config and init loading screen
const title = 'Vernonia';

// view
const view = new MapView({
  map: new Map({
    basemap: new Basemap({
      portalItem: {
        id: '6e9f78f3a26f48c89575941141fd4ac3',
      },
    }),
    layers: [
      new FeatureLayer({
        portalItem: {
          id: '5e1e805849ac407a8c34945c781c1d54',
        },
      }),
    ],
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

new Layout({
  view,
  loaderOptions: {
    title,
  },
  mapHeadingOptions: {
    title,
    logoUrl: 'city_logo_small_white.svg',
  },
  uiWidgets: [
    {
      widget: new Measure({ view }),
      text: 'Measure',
      icon: 'measure',
    },
    {
      widget: new PrintSnapshot({ view, printServiceUrl: '' }),
      text: 'Print',
      icon: 'print',
    },
  ],
});

// view.when(() => { });
