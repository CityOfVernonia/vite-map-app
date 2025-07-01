import '@esri/calcite-components/dist/calcite/calcite.css';
import '@arcgis/map-components/arcgis-map-components/arcgis-map-components.css';
import '@vernonia/core/dist/scss/cov.css';
import '@vernonia/core/dist/components/MapApplication.css';
import '@vernonia/core/dist/components/Measure.css';
import '@vernonia/core/dist/components/Sketch.css';

// arcgis config
import esriConfig from '@arcgis/core/config';
esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';
esriConfig.assetsPath = './arcgis';

// map components
import { setAssetPath } from '@arcgis/map-components';
setAssetPath('./map-components');

// calcite assets
import { defineCustomElements } from '@esri/calcite-components/dist/loader';
defineCustomElements(window, { resourcesUrl: './calcite' });

const load = async (): Promise<void> => {
  const Map = (await import('@arcgis/core/Map')).default;
  const MapView = (await import('@arcgis/core/views/MapView')).default;
  const Basemap = (await import('@arcgis/core/Basemap')).default;

  const { cityLimits, constraintExtent, extent } = await (
    await import('@vernonia/core/dist//support/cityBoundaryExtents')
  ).default('5e1e805849ac407a8c34945c781c1d54');

  const { applicationGraphicsLayer } = await import(
    '@vernonia/core/dist/support/layerUtils'
  );

  // basemaps
  const hillshade = new Basemap({
    portalItem: {
      id: '6e9f78f3a26f48c89575941141fd4ac3',
    },
    title: 'Hillshade',
  });

  const imagery = new Basemap({
    portalItem: {
      id: '2622b9aecacd401583981410e07d5bb9',
    },
    title: 'Imagery',
  });

  const view = new MapView({
    map: new Map({
      basemap: hillshade,
      layers: [cityLimits],
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
        breakpoint: false,
        buttonEnabled: false,
        position: 'bottom-left',
      },
    },
  });

  applicationGraphicsLayer(view);

  new (await import('@vernonia/core/dist/components/MapApplication')).default({
    basemapOptions: {
      hillshade,
      imagery,
    },
    components: [
      {
        component: new (await import('@vernonia/core/dist/components/Measure')).default({ view, visible: false }),
        icon: 'measure',
        text: 'Measure',
        type: 'calcite-panel',
      },
      {
        component: new (await import('@vernonia/core/dist/components/Sketch')).default({ view, visible: false }),
        icon: 'pencil',
        text: 'Sketch',
        type: 'calcite-panel',
      },
    ],
    title: 'Vite Map App',
    view,
    viewControlOptions: {
      includeFullscreen: true,
      includeLocate: true,
    },
  });
};

load();
