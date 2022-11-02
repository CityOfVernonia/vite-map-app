import esri = __esri;
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Legend from '@arcgis/core/widgets/Legend';

const CSS = {
  base: 'street-layers',
  content: 'street-layers_content',
};

@subclass('StreetLayers')
export default class StreetLayers extends Widget {
  constructor(
    properties: esri.WidgetProperties & {
      view: esri.MapView;
      layer: esri.MapImageLayer;
    },
  ) {
    super(properties);
  }

  postInitialize(): void {
    const {
      layer: { sublayers },
    } = this;

    const ids = [10, 20, 30, 40, 50, 60];

    sublayers.forEach((sublayer: esri.Sublayer): void => {
      sublayer.legendEnabled = ids.indexOf(sublayer.id) !== -1;
    });

    // this.sublayer = sublayers.find((sublayer: esri.Sublayer): boolean => {
    //   return sublayer.id === 70;
    // });

    // await this.sublayer.load();
  }

  view!: esri.MapView;

  layer!: esri.MapImageLayer;

  // sublayer!: esri.Sublayer;

  @property()
  state: 'layers' | 'filter' = 'layers';

  displayLayerVisibility(select: HTMLCalciteSelectElement): void {
    select.addEventListener('calciteSelectChange', (event: Event): void => {
      const {
        layer: { sublayers },
      } = this;

      [10, 20, 30, 40, 50, 60].forEach((id: number): void => {
        sublayers.find((sublayer: esri.Sublayer): boolean => {
          return sublayer.id === id;
        }).visible = false;
      });

      sublayers.find((sublayer: esri.Sublayer): boolean => {
        return sublayer.id === Number((event.target as HTMLCalciteSelectElement).selectedOption.value);
      }).visible = true;
    });
  }

  stationsVisibility(_switch: HTMLCalciteSwitchElement): void {
    _switch.addEventListener('calciteSwitchChange', (event: Event): void => {
      const {
        layer: { sublayers },
      } = this;

      [1, 2].forEach((id: number): void => {
        sublayers.find((sublayer: esri.Sublayer): boolean => {
          return sublayer.id === id;
        }).visible = (event.target as HTMLCalciteSwitchElement).checked;
      });
    });
  }

  arrowsVisibility(_switch: HTMLCalciteSwitchElement): void {
    _switch.addEventListener('calciteSwitchChange', (event: Event): void => {
      const {
        layer: { sublayers },
      } = this;

      sublayers.find((sublayer: esri.Sublayer): boolean => {
        return sublayer.id === 3;
      }).visible = (event.target as HTMLCalciteSwitchElement).checked;
    });
  }

  legendCreate(container: HTMLDivElement): void {
    const { view, layer } = this;
    new Legend({
      view,
      layerInfos: [
        {
          layer,
        },
      ],
      container,
    });
  }

  render(): tsx.JSX.Element {
    const { state } = this;
    return (
      <calcite-panel class={CSS.base} heading="Layers">
        {/* <calcite-action
          hidden={state !== 'layers'}
          icon="filter"
          slot={state === 'layers' ? 'header-actions-end' : ''}
          text="Filter"
          onclick={() => {
            this.state = 'filter';
          }}
        >
          <calcite-tooltip placement="bottom" slot="tooltip">
            Filter
          </calcite-tooltip>
        </calcite-action>
        <calcite-action
          hidden={state !== 'filter'}
          icon="layers"
          slot={state === 'filter' ? 'header-actions-end' : ''}
          text="Layers"
          onclick={() => {
            this.state = 'layers';
          }}
        >
          <calcite-tooltip placement="bottom" slot="tooltip">
            Layers
          </calcite-tooltip>
        </calcite-action> */}
        <div class={CSS.content} hidden={state !== 'layers'}>
          <calcite-label>
            Display
            <calcite-select afterCreate={this.displayLayerVisibility.bind(this)}>
              <calcite-option selected="" value="10">
                Functional Classification
              </calcite-option>
              <calcite-option value="20">ODOT Reported</calcite-option>
              <calcite-option value="30">Ownership</calcite-option>
              <calcite-option value="40">Surface Condition</calcite-option>
              <calcite-option value="50">Surface Type</calcite-option>
              <calcite-option value="60">Surface Width</calcite-option>
            </calcite-select>
          </calcite-label>
          <calcite-label layout="inline-space-between">
            Stations (m values)
            <calcite-switch afterCreate={this.stationsVisibility.bind(this)}></calcite-switch>
          </calcite-label>
          <calcite-label layout="inline-space-between">
            Direction arrows
            <calcite-switch afterCreate={this.arrowsVisibility.bind(this)}></calcite-switch>
          </calcite-label>
          <div afterCreate={this.legendCreate.bind(this)}></div>
        </div>
        {/* <div class={CSS.content} hidden={state !== 'filter'}></div> */}
      </calcite-panel>
    );
  }
}
