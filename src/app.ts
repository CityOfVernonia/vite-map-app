import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map and view
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

// application
import ShellApplicationMap from '@vernonia/core/dist/layouts/ShellApplicationMap';
import cityBoundaryExtents from '@vernonia/core/dist/support/cityBoundaryExtents';

// widgets
import Measure from '@vernonia/core/dist/widgets/Measure';
import PrintSnapshot from '@vernonia/core/dist/widgets/PrintSnapshot';

import NewWidget from './widgets/NewWidget';
import NewFeatureLayerWidget from './widgets/NewFeatureLayerWidget';

// config portal and auth
esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';
esriConfig.assetsPath = './arcgis';

const load = async () => {
  // layers and friends
  const { hillshadeBasemap, hybridBasemap, taxLots, featureLayer, whenView, searchViewModel } = await import(
    './layers'
  );

  const { cityLimits, extent, constraintExtent } = await cityBoundaryExtents('5e1e805849ac407a8c34945c781c1d54');

  // view
  const view = new MapView({
    map: new Map({
      basemap: hillshadeBasemap,
      layers: [taxLots, cityLimits, featureLayer],
      ground: 'world-elevation',
    }),
    extent,
    constraints: {
      geometry: constraintExtent,
      minScale: 40000,
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

  view.when(whenView);

  // application
  new ShellApplicationMap({
    headerOptions: { searchViewModel },
    nextBasemap: hybridBasemap,
    panelPosition: 'end',
    panelWidgets: [
      {
        widget: new NewWidget({ view, layer: cityLimits }),
        text: 'New',
        icon: 'plus',
        type: 'calcite-panel',
        open: true,
      },
      {
        widget: new NewFeatureLayerWidget({ view, layer: featureLayer }),
        text: 'Feature Layer',
        icon: 'feature-layer',
        type: 'calcite-panel',
        groupEnd: true,
      },
      {
        widget: new Measure({ view }),
        text: 'Measure',
        icon: 'measure',
        type: 'calcite-panel',
      },
      {
        widget: new PrintSnapshot({ view, printServiceUrl: '' }),
        text: 'Print',
        icon: 'print',
        type: 'calcite-panel',
      },
    ],
    title: 'Vite Map App',
    view,
    viewControlOptions: {
      includeLocate: true,
      includeFullscreen: true,
    },
  });
};

load();
