import './main.scss';

import esri = __esri;

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';

import MapApplication from '@vernonia/map-application/dist/MapApplication';

import StreetInfo from './widgets/StreetInfo';
import StreetLayers from './widgets/StreetLayers';

import './widgets/Streets.scss';

// widgets
import Measure from '@vernonia/core/dist/widgets/Measure';
import '@vernonia/core/dist/widgets/Measure.css';

import PrintSnapshot from '@vernonia/core/dist/widgets/PrintSnapshot';
import '@vernonia/core/dist/widgets/Snapshot.css';

// config portal and auth
esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

const load = async () => {
  const cityLimits = new FeatureLayer({
    portalItem: {
      id: '5e1e805849ac407a8c34945c781c1d54',
    },
  });

  await cityLimits.load();

  const streets = new MapImageLayer({
    portalItem: {
      id: '92953f370b9d483da40b1c424a3983c2',
    },
  });

  await streets.load();

  streets.sublayers.forEach((sublayer: esri.Sublayer): void => {
    sublayer.popupEnabled = false;
  });

  const centerlines = new FeatureLayer({
    url: `${streets.url}/70`,
    opacity: 0,
    outFields: ['*'],
    popupEnabled: false,
  });

  // view
  const view = new MapView({
    map: new Map({
      basemap: new Basemap({
        portalItem: {
          id: '2ae669ac07e646b19726b95ff04c06c3',
        },
      }),
      layers: [cityLimits, centerlines, streets],
      ground: 'world-elevation',
    }),
    extent: cityLimits.fullExtent,
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

  const streetInfo = new StreetInfo({ view, layer: centerlines });

  const app = new MapApplication({
    contentBehind: true,
    title: 'Vernonia Streets',
    // nextBasemap: new Basemap({
    //   portalItem: {
    //     id: '2622b9aecacd401583981410e07d5bb9',
    //   },
    // }),
    panelPosition: 'end',
    panelWidgets: [
      {
        widget: streetInfo,
        text: 'Info',
        icon: 'information',
        type: 'calcite-panel',
        open: true,
      },
      {
        widget: new StreetLayers({ view, layer: streets }),
        text: 'Layers',
        icon: 'layers',
        type: 'calcite-panel',
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
    searchViewModel: new SearchViewModel({ view }),
    view,
  });

  streetInfo.on('show-widget', app.showWidget.bind(app));

  // view.when(() => { });
};

load();
