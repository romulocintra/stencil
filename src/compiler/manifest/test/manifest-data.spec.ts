import { ComponentData, ComponentMeta, Config, Manifest, ManifestData, ModuleFile } from '../../../util/interfaces';
import { mockConfig } from '../../../testing/mocks';
import { ENCAPSULATION, MEMBER_TYPE, PRIORITY, PROP_TYPE } from '../../../util/constants';
import { excludeFromCollection, parseBundles, parseComponentDataToModuleFile,
  parseDidChangeDeprecated, parseGlobal, parseWillChangeDeprecated,
  serializeAppGlobal, serializeAppManifest, serializeBundles } from '../manifest-data';


describe('manifest-data serialize/parse', () => {

  let manifest: Manifest;
  let a: ComponentMeta;
  let moduleFile: ModuleFile;
  const manifestDir = '/User/me/myapp/dist/collection/';
  const config = mockConfig();

  beforeEach(() => {
    manifest = {};
    a = {};
    moduleFile = {
      jsFilePath: '/User/me/myapp/dist/collection/components/cmp-a.js',
      cmpMeta: a
    };
  });


  it('parseGlobal', () => {
    const manifestData: ManifestData = {
      global: 'global/my-global.js'
    };
    const manifest: Manifest = {};
    parseGlobal(config, manifestDir, manifestData, manifest);
    expect(manifest.global.jsFilePath).toBe('/User/me/myapp/dist/collection/global/my-global.js');
  });

  it('serializeAppManifest', () => {
    config.bundles = [
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] }
    ];
    manifest.bundles = [
      { components: ['cmp-b', 'cmp-a'] },
      { components: ['cmp-d'] },
      { components: ['cmp-c'] }
    ];
    manifest.modulesFiles = [moduleFile];
    const outManifest = serializeAppManifest(config, manifestDir, manifest);

    expect(outManifest.bundles).toEqual([
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] },
      { components: ['cmp-d'] }
    ]);
    expect(outManifest.components).toHaveLength(1);
    expect(outManifest.compiler.name).toEqual('test');
  });

  it('serializeAppGlobal', () => {
    const manifestData: ManifestData = {};
    const manifest: Manifest = {
      global: {
        jsFilePath: '/User/me/myapp/dist/collection/global/my-global.js'
      }
    };

    serializeAppGlobal(config, manifestDir, manifestData, manifest);
    expect(manifestData.global).toBe('global/my-global.js');
  });

  it('excludeFromCollection false if tag is in bundles', () => {
    const config: Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-b'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(false);
  });

  it('excludeFromCollection true if tag not in bundles', () => {
    const config: Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-c'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

  it('excludeFromCollection defaults true', () => {
    const config: Config = {};
    const cmpData: ComponentData = {};
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

});
