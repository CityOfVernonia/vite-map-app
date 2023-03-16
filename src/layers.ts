import esri = __esri;
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Color from '@arcgis/core/Color';
import SearchViewModel from '@arcgis/core/widgets/Search/SearchViewModel';
import LayerSearchSource from '@arcgis/core/widgets/Search/LayerSearchSource';

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

// layers
export const cityLimits = new FeatureLayer({
  portalItem: {
    id: '5e1e805849ac407a8c34945c781c1d54',
  },
});

export const taxLots = new FeatureLayer({
  portalItem: {
    id: 'a0837699982f41e6b3eb92429ecdb694',
  },
  outFields: ['*'],
  popupTemplate: new PopupTemplate({
    title: '{TAXLOT_ID}',
    content: (event: { graphic: esri.Graphic }): HTMLElement => {
      const { TAXLOT_ID, ACCOUNT_IDS, TAXMAP, ADDRESS, OWNER, ACRES, SQ_FEET } = event.graphic.attributes;

      const address = ADDRESS
        ? `
        <tr>
          <th>Address (Primary Situs)</th>
          <td>${ADDRESS}</td>
        </tr>
      `
        : '';

      const accounts = ACCOUNT_IDS.split(',').map((account: string): string => {
        return `
          <calcite-link href="https://propertyquery.columbiacountyor.gov/columbiaat/MainQueryDetails.aspx?AccountID=${account}&QueryYear=2023&Roll=R" target="_blank">${account}</calcite-link>
        `;
      });

      const taxLotUrl = location.hostname === 'localhost' ? `/tax-lot/?id=${TAXLOT_ID}` : `/tax-lot/${TAXLOT_ID}/`;

      const el = new DOMParser().parseFromString(
        `<table class="esri-widget__table">
          <tr>
            <th>Tax lot</th>
            <td>
              <calcite-link href=${taxLotUrl} target="_blank">${TAXLOT_ID}</calcite-link>
            </td>
          </tr>
          <tr>
            <th>Tax map</th>
            <td>
              <calcite-link href="https://gis.columbiacountymaps.com/TaxMaps/${TAXMAP}.pdf" target="_blank">${TAXMAP}</calcite-link>
            </td>
          </tr>
          <tr>
            <th>Owner</th>
            <td>${OWNER}</td>
          </tr>
          ${address}
          <tr>
            <th>Area</th>
            <td>${ACRES} acres&nbsp;&nbsp;${(SQ_FEET as number).toLocaleString()} sq ft</td>
          </tr>
          <tr>
            <th>Tax account(s)</th>
            <td>
              ${accounts.join('&nbsp;')}
            </td>
          </tr>
        </table>`,
        'text/html',
      );

      return el.body.firstChild as HTMLTableElement;
    },
  }),
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
 * Return extents for view.
 * @returns extent and constraint geometry
 */
export const extents = async (): Promise<{ extent: esri.Extent; constraintGeometry: esri.Extent }> => {
  await cityLimits.load();
  const extent = cityLimits.fullExtent.clone();
  return {
    extent,
    constraintGeometry: extent.clone().expand(3),
  };
};

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
