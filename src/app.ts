import './main.scss';

import esri = __esri;

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map and view
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Color from '@arcgis/core/Color';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';
import LayerSearchSource from '@arcgis/core/widgets/Search/LayerSearchSource';
import taxLotPopup from '@vernonia/core/dist/popups/TaxLotPopup';

// application
import MapApplication from '@vernonia/core/dist/layouts/MapApplication';
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
  const { cityLimits, extent, constraintExtent } = await cityBoundaryExtents('5e1e805849ac407a8c34945c781c1d54');

  const hillshadeBasemap = new Basemap({
    portalItem: {
      id: '6e9f78f3a26f48c89575941141fd4ac3',
    },
  });

  const hybridBasemap = new Basemap({
    portalItem: {
      id: '2622b9aecacd401583981410e07d5bb9',
    },
  });

  const taxLots = new FeatureLayer({
    portalItem: {
      id: 'a0837699982f41e6b3eb92429ecdb694',
    },
    outFields: ['*'],
    popupTemplate: taxLotPopup,
  });

  taxLots.when((): void => {
    const tlr = taxLots.renderer as esri.SimpleRenderer;
    const tls = tlr.symbol as esri.SimpleFillSymbol;
    view.map.watch('basemap', (basemap: esri.Basemap): void => {
      tls.outline.color = basemap === hybridBasemap ? new Color([246, 213, 109, 0.5]) : new Color([152, 114, 11, 0.5]);
    });
  });

  const featureLayer = new FeatureLayer({
    url: 'https://gis.vernonia-or.gov/server/rest/services/UtilityMapping/Water/MapServer/0',
    outFields: ['*'],
    popupEnabled: false,
    title: 'Fire Hydrants',
  });

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

  const searchViewModel = new SearchViewModel({
    view,
    searchAllEnabled: false,
    includeDefaultSources: false,
    locationEnabled: false,
    sources: [
      new LayerSearchSource({
        layer: taxLots,
        outFields: ['*'],
        searchFields: ['ADDRESS'],
        suggestionTemplate: '{ADDRESS}',
        placeholder: 'Tax lot by address',
        name: 'Tax lot by address',
      }),
      new LayerSearchSource({
        layer: taxLots,
        outFields: ['*'],
        searchFields: ['OWNER'],
        suggestionTemplate: '{OWNER}',
        placeholder: 'Tax lot by owner',
        name: 'Tax lot by owner',
      }),
      new LayerSearchSource({
        layer: taxLots,
        outFields: ['*'],
        searchFields: ['ACCOUNT_IDS'],
        suggestionTemplate: '{ACCOUNT_IDS}',
        placeholder: 'Tax lot by tax account',
        name: 'Tax lot by tax account',
      }),
      new LayerSearchSource({
        layer: taxLots,
        outFields: ['*'],
        searchFields: ['TAXLOT_ID'],
        suggestionTemplate: '{TAXLOT_ID}',
        placeholder: 'Tax lot by map and lot',
        name: 'Tax lot by map and lot',
      }),
    ],
  });

  const newWidget = new NewWidget({ view, layer: cityLimits });

  const mapApplication = new MapApplication({
    endWidgetInfo: {
      icon: 'lightbulb',
      text: 'About',
      type: 'panel',
      widget: new PrintSnapshot({ view, printServiceUrl: '' }),
    },
    nextBasemap: hybridBasemap,
    title: 'Vite Map App',
    searchViewModel,
    view,
    viewControlOptions: {
      includeFullscreen: true,
      includeLocate: true,
    },
    widgetInfos: [
      {
        icon: 'plus',
        text: 'New',
        type: 'panel',
        widget: newWidget,
      },
      {
        groupEnd: true,
        icon: 'feature-layer',
        text: 'Feature Layer',
        type: 'panel',
        widget: new NewFeatureLayerWidget({ view, layer: featureLayer }),
      },
      {
        icon: 'measure',
        text: 'Measure',
        type: 'panel',
        widget: new Measure({ view }),
      },
      {
        icon: 'print',
        text: 'Text',
        type: 'panel',
        widget: new PrintSnapshot({ view, printServiceUrl: '' }),
      },
    ],
  });

  mapApplication.on('load', (): void => {
    mapApplication.showWidget(newWidget.id);

    setTimeout((): void => {
      mapApplication.showAlert({
        duration: 'fast',
        label: 'template application',
        message: 'This is a template application for City of Vernonia web maps.',
        title: 'Vite Map App',
      });
    }, 5000);
  });
};

load();
