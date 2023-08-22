import esri = __esri;
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Color from '@arcgis/core/Color';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';
import LayerSearchSource from '@arcgis/core/widgets/Search/LayerSearchSource';
import taxLotPopup from '@vernonia/core/dist/popups/TaxLotPopup';

// basemaps
export const hillshadeBasemap = new Basemap({
  portalItem: {
    id: '6e9f78f3a26f48c89575941141fd4ac3',
  },
});

export const hybridBasemap = new Basemap({
  portalItem: {
    id: '2622b9aecacd401583981410e07d5bb9',
  },
});

export const taxLots = new FeatureLayer({
  portalItem: {
    id: 'a0837699982f41e6b3eb92429ecdb694',
  },
  outFields: ['*'],
  popupTemplate: taxLotPopup,
});

export const featureLayer = new FeatureLayer({
  url: 'https://gis.vernonia-or.gov/server/rest/services/UtilityMapping/Water/MapServer/0',
  outFields: ['*'],
  popupEnabled: false,
  title: 'Fire Hydrants',
});

// default tax lot search
export const searchViewModel = new SearchViewModel({
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

/**
 * Anything layer related to perform after view.
 * @param view
 */
export const whenView = (view: esri.MapView): void => {
  taxLots.when((): void => {
    const tlr = taxLots.renderer as esri.SimpleRenderer;
    const tls = tlr.symbol as esri.SimpleFillSymbol;
    view.map.watch('basemap', (basemap: esri.Basemap): void => {
      tls.outline.color = basemap === hybridBasemap ? new Color([246, 213, 109, 0.5]) : new Color([152, 114, 11, 0.5]);
    });
  });
};
