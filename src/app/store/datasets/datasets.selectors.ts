import { compose, createSelector } from '@ngrx/store';

import { Entities, Mod, ModData, ModInfo } from '~/models';
import { State } from '..';
import { DatasetsState } from './datasets.reducer';

/* Base selector functions */
export const datasetsState = (state: State): DatasetsState =>
  state.datasetsState;
const sAppData = (state: DatasetsState): Mod => state.app;
const sBaseSets = (state: DatasetsState): ModInfo[] => state.base;
const sModSets = (state: DatasetsState): ModInfo[] => state.mods;
const sDataEntities = (state: DatasetsState): Entities<ModData> =>
  state.dataEntities;

/* Simple selectors */
export const getAppData = compose(sAppData, datasetsState);
export const getBaseSets = compose(sBaseSets, datasetsState);
export const getModSets = compose(sModSets, datasetsState);
export const getDataEntities = compose(sDataEntities, datasetsState);

/* Complex selectors */
export const getBaseInfoEntities = createSelector(getBaseSets, (base) =>
  base.reduce((e: Entities<ModInfo>, b) => {
    e[b.id] = b;
    return e;
  }, {})
);

export const getBaseEntities = createSelector(
  getBaseSets,
  getDataEntities,
  (base, entities) =>
    base.reduce((e: Entities<Mod>, b) => {
      e[b.id] = entities[b.id] ? { ...b, ...entities[b.id] } : null;
      return e;
    }, {})
);

export const getModEntities = createSelector(
  getModSets,
  getDataEntities,
  (mod, entities) =>
    mod.reduce((e: Entities<Mod>, m) => {
      e[m.id] = entities[m.id] ? { ...m, ...entities[m.id] } : null;
      return e;
    }, {})
);
