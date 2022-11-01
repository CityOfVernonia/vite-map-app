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
  }

  view!: esri.MapView;

  layer!: esri.MapImageLayer;

  private _displayLayerVisibility(select: HTMLCalciteSelectElement): void {
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

  private _stationsVisibility(_switch: HTMLCalciteSwitchElement): void {
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

  private _arrowsVisibility(_switch: HTMLCalciteSwitchElement): void {
    _switch.addEventListener('calciteSwitchChange', (event: Event): void => {
      const {
        layer: { sublayers },
      } = this;

      sublayers.find((sublayer: esri.Sublayer): boolean => {
        return sublayer.id === 3;
      }).visible = (event.target as HTMLCalciteSwitchElement).checked;
    });
  }

  private _legendCreate(container: HTMLDivElement): void {
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
    return (
      <calcite-panel class={CSS.base} heading="Layers">
        <div class={CSS.content}>
          <calcite-label>
            Display
            <calcite-select afterCreate={this._displayLayerVisibility.bind(this)}>
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
            <calcite-switch afterCreate={this._stationsVisibility.bind(this)}></calcite-switch>
          </calcite-label>
          <calcite-label layout="inline-space-between">
            Direction arrows
            <calcite-switch afterCreate={this._arrowsVisibility.bind(this)}></calcite-switch>
          </calcite-label>
          <div afterCreate={this._legendCreate.bind(this)}></div>
        </div>
      </calcite-panel>
    );
  }
}
