import esriConfig from '@arcgis/core/config';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import CalciteNavigation from 'cov-arcgis-esm/src/widgets/CalciteNavigation';

import MapScale from './widgets/MapScale';

esriConfig.portalUrl = 'https://gisportal.vernonia-or.gov/portal';

const cityLimits = new FeatureLayer({
  portalItem: {
    id: 'eb0c7507611e44b7923dd1c0167e3b92',
  },
});

const ugb = new FeatureLayer({
  portalItem: {
    id: '2f760ba990ab4d6e831d04b85a8a0bf3',
  },
});

const taxLots = new FeatureLayer({
  portalItem: {
    id: 'a6063eb199e640e0bbc2d5ceca23de9a',
  },
});

const view = new MapView({
  map: new Map({
    basemap: new Basemap({
      portalItem: {
        id: 'f36cd213cc934d2391f58f389fc9eaec',
      },
    }),
    layers: [taxLots, ugb, cityLimits],
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
  container: document.createElement('div'),
});

view.ui.empty('top-left');

view.when(() => {
  view.ui.add(
    new CalciteNavigation({ view }),
    'top-left',
  );

  view.ui.add(
    new MapScale({
      view,
    }),
    'top-right',
  );
});

document.body.append(view.container);
