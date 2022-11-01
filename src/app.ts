import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';

import MapApplication from '@vernonia/map-application/dist/MapApplication';

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

  // view
  const view = new MapView({
    map: new Map({
      basemap: new Basemap({
        portalItem: {
          id: '6e9f78f3a26f48c89575941141fd4ac3',
        },
      }),
      layers: [cityLimits],
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

  new MapApplication({
    contentBehind: true,
    title: 'Vite Map App',
    nextBasemap: new Basemap({
      portalItem: {
        id: '2622b9aecacd401583981410e07d5bb9',
      },
    }),
    panelPosition: 'end',
    panelWidgets: [
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

  // view.when(() => { });
};

load();
